import type { APIRoute } from 'astro';

export const prerender = false;

// Simple in-memory rate limiter: 5 requests per IP per minute
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const MAX_IDEA_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1200;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  // Clean old entries
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  requestLog.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function recordRequest(ip: string): void {
  const timestamps = requestLog.get(ip) || [];
  timestamps.push(Date.now());
  requestLog.set(ip, timestamps);
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return 'unknown';
}

const SYSTEM_PROMPT = `You are the "Graveyard Oracle" — a product mortician AI working for Product Grave, a digital graveyard for dead tech products.

Your job is to perform a PRE-MORTEM analysis on the user's startup idea. You do NOT predict the future. You analyze the idea against thousands of real dead products in our database and identify historical patterns of failure.

## Output Format (strict Markdown)

Respond in the following sections:

### ⚰️ Risk Assessment
Give an overall risk level: **LOW** / **MEDIUM** / **HIGH** / **EXTREME**
Brief 1-2 sentence summary of why.

### 🔍 Historical Similar Deaths
List 2-3 real dead products from tech history that died from similar causes. For each:
- **Name** (Years Alive) — One-sentence cause of death
- What pattern they share with this idea

### ⚠️ Potential Death Traps
List 3-5 specific risks this idea faces, based on historical failures. Be concrete and specific.

### 💡 If You Still Want To Build This
Give 2-3 actionable recommendations:
- What metrics to watch
- What assumptions to validate first
- What pivot path to keep open

## Tone Guidelines
- Dark humor but genuinely helpful
- Black market fortune teller meets seasoned VC
- Use phrases like "Based on the autopsy records..." or "History suggests..."
- Never say "this will fail" — say "history shows similar ideas typically die from X"
- If the idea is actually solid, say so — but still point out the risks that could kill it

## Constraints
- Keep total response under 800 words
- Use Markdown formatting (bold, bullet lists)
- Do not hallucinate products — only reference well-known tech failures`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = getClientIP(request);

    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a minute before trying again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { idea, description } = body;

    if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: 'Idea name is required (min 3 characters).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (idea.trim().length > MAX_IDEA_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Idea name must be ${MAX_IDEA_LENGTH} characters or less.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (typeof description === 'string' && description.trim().length > MAX_DESCRIPTION_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Details must be ${MAX_DESCRIPTION_LENGTH} characters or less.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    recordRequest(clientIP);

    const apiKey = import.meta.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error: DEEPSEEK_API_KEY not set.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userPrompt = `Startup Idea: ${idea.trim()}\n\nAdditional Details:\n${(description || 'No additional details provided.').trim()}`;

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('DeepSeek API error:', res.status, errText);
      return new Response(
        JSON.stringify({ error: `AI service error (${res.status}). Please try again later.` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const report = data.choices?.[0]?.message?.content;

    if (!report) {
      return new Response(
        JSON.stringify({ error: 'Empty response from AI service.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ report }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('API error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
