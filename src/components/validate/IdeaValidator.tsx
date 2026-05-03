import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';

const MAX_IDEA_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1200;
const HISTORY_STORAGE_KEY = 'product-grave-oracle-history';
const MAX_HISTORY_ITEMS = 20;

type SavedReport = {
  id: string;
  idea: string;
  description: string;
  report: string;
  riskLevel: string | null;
  deathScore: number | null;
  createdAt: string;
};

function escapeHtml(markdown: string) {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hashText(text: string) {
  return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getRiskLevel(text: string) {
  const normalized = text.toUpperCase();

  const sectionMatch =
    normalized.match(/RISK ASSESSMENT[\s\S]{0,220}?(EXTREME|HIGH|MEDIUM|LOW)/i) ||
    normalized.match(/OVERALL RISK[\s:：-]{0,12}(EXTREME|HIGH|MEDIUM|LOW)/i) ||
    normalized.match(/RISK LEVEL[\s:：-]{0,12}(EXTREME|HIGH|MEDIUM|LOW)/i);

  if (sectionMatch) return sectionMatch[1].toUpperCase();

  const anyMatch = normalized.match(/\b(EXTREME|HIGH|MEDIUM|LOW)\b/i);
  return anyMatch ? anyMatch[1].toUpperCase() : null;
}

function getDeathScore(level: string | null, ideaText: string, descriptionText: string) {
  if (!level) return null;

  const baseScores: Record<string, number> = {
    LOW: 28,
    MEDIUM: 54,
    HIGH: 76,
    EXTREME: 92,
  };
  const variance = (hashText(`${ideaText}:${descriptionText}`) % 13) - 6;
  return Math.max(1, Math.min(99, baseScores[level] + variance));
}

function getScoreLabel(score: number | null) {
  if (!score) return null;
  if (score >= 85) return 'Terminal';
  if (score >= 70) return 'Critical';
  if (score >= 45) return 'Unstable';
  return 'Survivable';
}

export default function IdeaValidator() {
  const [idea, setIdea] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<SavedReport[]>([]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!idea.trim() || idea.trim().length < 3) {
        setError('Idea name must be at least 3 characters.');
        return;
      }
      if (idea.trim().length > MAX_IDEA_LENGTH) {
        setError(`Idea name must be ${MAX_IDEA_LENGTH} characters or less.`);
        return;
      }
      if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
        setError(`Details must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
        return;
      }

      setLoading(true);
      setError('');
      setReport('');

      try {
        const res = await fetch('/api/validate-idea/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea: idea.trim(), description: description.trim() }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || 'Something went wrong. Please try again.');
          return;
        }

        const nextReport = data.report;
        const nextRiskLevel = getRiskLevel(nextReport);
        const nextDeathScore = getDeathScore(nextRiskLevel, idea.trim(), description.trim());

        setReport(nextReport);
        saveReport({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          idea: idea.trim(),
          description: description.trim(),
          report: nextReport,
          riskLevel: nextRiskLevel,
          deathScore: nextDeathScore,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    },
    [idea, description]
  );

  const handleReset = () => {
    setIdea('');
    setDescription('');
    setReport('');
    setError('');
  };

  const loadHistory = () => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setHistory(parsed);
    } catch {
      setHistory([]);
    }
  };

  const persistHistory = (items: SavedReport[]) => {
    setHistory(items);
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  };

  const saveReport = (item: SavedReport) => {
    const nextHistory = [item, ...history.filter((saved) => saved.id !== item.id)].slice(0, MAX_HISTORY_ITEMS);
    persistHistory(nextHistory);
  };

  const handleLoadReport = (item: SavedReport) => {
    setIdea(item.idea);
    setDescription(item.description);
    setReport(item.report);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReport = (id: string) => {
    persistHistory(history.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    persistHistory([]);
  };

  const handleShareTwitter = () => {
    const score = deathScore ? `${deathScore}/100 death risk` : 'a death-risk report';
    const text = encodeURIComponent(`The Graveyard Oracle gave "${idea}" ${score}.`);
    const url = encodeURIComponent('https://www.productgrave.net/validate-idea/');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://www.productgrave.net/validate-idea/');
      alert('Link copied to clipboard!');
    } catch {
      alert('Failed to copy link.');
    }
  };

  const wrapCanvasText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    words.forEach((word, index) => {
      const testLine = line ? `${line} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }

      if (index === words.length - 1 && line) {
        ctx.fillText(line, x, currentY);
      }
    });
  };

  const buildScoreCardCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const score = deathScore || 0;
    const label = scoreLabel || 'Unknown';
    const risk = riskLevel || 'UNKNOWN';

    ctx.fillStyle = '#1A1423';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(230, 160, 20, 620, 300, 720);
    gradient.addColorStop(0, 'rgba(87, 204, 153, 0.18)');
    gradient.addColorStop(0.48, 'rgba(224, 122, 95, 0.12)');
    gradient.addColorStop(1, 'rgba(26, 20, 35, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#3E3633';
    ctx.lineWidth = 6;
    ctx.strokeRect(54, 54, 1092, 522);
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, 1040, 470);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#57CC99';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('PRODUCT GRAVE ORACLE', 600, 125);

    ctx.fillStyle = '#F4F1DE';
    ctx.font = 'bold 38px serif';
    wrapCanvasText(ctx, idea || 'Unnamed idea', 600, 185, 880, 44);

    ctx.fillStyle = '#E07A5F';
    ctx.font = 'bold 118px serif';
    ctx.fillText(String(score), 565, 350);
    ctx.fillStyle = '#6B6560';
    ctx.font = 'bold 34px monospace';
    ctx.fillText('/100', 705, 345);

    ctx.fillStyle = '#F2CC8F';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${label.toUpperCase()} · RISK ${risk}`, 600, 405);

    ctx.fillStyle = '#B5B0A3';
    ctx.font = '24px serif';
    wrapCanvasText(ctx, 'The Graveyard Oracle ran a startup pre-mortem. History has notes.', 600, 465, 820, 32);

    ctx.fillStyle = '#6B6560';
    ctx.font = '18px monospace';
    ctx.fillText('productgrave.net/validate-idea/', 600, 535);

    return canvas;
  };

  const getScoreCardBlob = async () => {
    const canvas = buildScoreCardCanvas();
    if (!canvas) return null;
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
  };

  const handleDownloadScoreCard = async () => {
    const blob = await getScoreCardBlob();
    if (!blob) {
      alert('Could not generate score card.');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${idea.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'idea'}-death-score.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareScoreCard = async () => {
    const blob = await getScoreCardBlob();
    if (!blob) {
      alert('Could not generate score card.');
      return;
    }

    const file = new File([blob], `${idea || 'Idea'} Death Score.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `${idea} Death Score`,
        text: `The Graveyard Oracle gave "${idea}" ${deathScore}/100 death risk.`,
        url: 'https://www.productgrave.net/validate-idea/',
        files: [file],
      });
      return;
    }

    await handleDownloadScoreCard();
    alert('X web sharing cannot attach a generated local image. The PNG was downloaded; upload it manually with your post.');
  };

  const riskLevel = report ? getRiskLevel(report) : null;
  const deathScore = getDeathScore(riskLevel, idea, description);
  const scoreLabel = getScoreLabel(deathScore);

  useEffect(() => {
    loadHistory();
  }, []);

  const riskColors: Record<string, string> = {
    LOW: 'border-grave-ghost text-grave-ghost',
    MEDIUM: 'border-grave-candle text-grave-candle',
    HIGH: 'border-grave-blood text-grave-blood',
    EXTREME: 'border-grave-blood text-grave-blood bg-grave-blood/10',
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {!report ? (
        <>
          <div className="text-center mb-10">
            <div className="text-4xl mb-4">🔮</div>
            <h2 className="font-pixel text-sm md:text-base text-grave-bone text-shadow-pixel mb-3">
              THE GRAVEYARD ORACLE
            </h2>
            <p className="text-grave-ash text-sm leading-relaxed max-w-lg mx-auto">
              Tell us your startup idea. We'll cross-reference it against Product Grave failure patterns
              and deliver a pre-mortem report.
            </p>
            <p className="text-xs text-grave-etch mt-2">
              No data is stored. Analysis is generated in real-time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pixel-card p-6 md:p-8 space-y-6">
            <div>
              <label className="block font-pixel text-[10px] text-grave-ash mb-2 uppercase">
                Your Idea *
              </label>
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A subscription service for renting houseplants"
                className="w-full bg-grave-night border-2 border-grave-stone px-3 py-2 text-sm text-grave-bone focus:border-grave-ghost outline-none transition-colors"
                required
                minLength={3}
                maxLength={MAX_IDEA_LENGTH}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-grave-ash mb-2 uppercase">
                Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Target market, business model, funding stage, competitive landscape..."
                rows={5}
                maxLength={MAX_DESCRIPTION_LENGTH}
                className="w-full bg-grave-night border-2 border-grave-stone px-3 py-2 text-sm text-grave-bone focus:border-grave-ghost outline-none transition-colors resize-y"
                disabled={loading}
              />
              <p className="text-[10px] text-grave-etch mt-1 text-right">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>

            {error && (
              <div className="text-sm text-grave-blood border border-grave-blood/30 bg-grave-blood/5 px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="pixel-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Consulting the dead...' : 'Get Pre-Mortem Report'}
            </button>
          </form>

          {loading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="font-pixel text-xs text-grave-ghost mb-3 animate-pulse">
                🔮 Consulting the archives...
              </div>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-grave-ghost rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-grave-ghost rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-grave-ghost rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-xs text-grave-etch mt-4">
                Analyzing historical death patterns...
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📜</div>
            <h2 className="font-pixel text-sm md:text-base text-grave-bone text-shadow-pixel mb-2">
              PRE-MORTEM REPORT
            </h2>
            <p className="text-grave-ash text-sm">
              Subject: <span className="text-grave-bone">{idea}</span>
            </p>
            {riskLevel && (
              <div className="mt-4 inline-block">
                <span
                  className={`inline-block font-pixel text-xs px-4 py-2 border-2 ${riskColors[riskLevel] || 'border-grave-etch text-grave-etch'}`}
                >
                  RISK: {riskLevel}
                </span>
              </div>
            )}
          </div>

          {deathScore && (
            <div className="pixel-card p-6 md:p-8 mb-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-grave-blood/10 via-transparent to-grave-ghost/10 pointer-events-none" />
              <div className="relative">
                <p className="font-pixel text-[10px] text-grave-ash mb-3 uppercase tracking-widest">
                  Startup Death Score
                </p>
                <div className="flex items-end justify-center gap-2 mb-3">
                  <span className="font-pixel text-5xl md:text-6xl text-grave-blood text-shadow-pixel">
                    {deathScore}
                  </span>
                  <span className="font-pixel text-sm text-grave-etch mb-2">/100</span>
                </div>
                <p className="font-pixel text-xs text-grave-ghost mb-3">{scoreLabel}</p>
                <div className="mx-auto max-w-sm h-4 border-2 border-grave-stone bg-grave-night overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-grave-ghost via-grave-candle to-grave-blood"
                    style={{ width: `${deathScore}%` }}
                  />
                </div>
                <p className="text-xs text-grave-etch mt-3">
                  Shareable risk signal based on the Oracle's risk level and your idea details.
                </p>
              </div>
            </div>
          )}

          <div className="pixel-card p-6 md:p-8 mb-8">
            <div
              className="prose prose-invert prose-grave max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: marked.parse(escapeHtml(report), { async: false }) as string }}
            />
          </div>

          <div className="pixel-card p-6 text-center mb-8">
            <p className="font-pixel text-xs text-grave-ash mb-3">Share this death report</p>
            <p className="text-xs text-grave-etch mb-4">
              X web intent cannot attach a generated local image automatically. Download the score card, or use native share where supported.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={handleShareTwitter} className="pixel-btn text-[10px] border-grave-ghost/60 text-grave-ghost hover:bg-grave-ghost hover:text-grave-night">
                Share to X
              </button>
              <button onClick={handleDownloadScoreCard} className="pixel-btn text-[10px]">
                Download Score Card
              </button>
              <button onClick={handleCopyLink} className="pixel-btn text-[10px]">
                Copy Link
              </button>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleReset} className="pixel-btn text-[10px]">
              🔮 Analyze Another Idea
            </button>
          </div>
        </div>
      )}

      <section className="mt-12">
        <div className="grave-divider mb-6">
          <span className="font-pixel text-xs text-grave-ash whitespace-nowrap">📚 PAST REPORTS</span>
        </div>

        <div className="pixel-card p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-pixel text-xs text-grave-bone mb-2">Your local archive</h2>
              <p className="text-xs text-grave-etch leading-relaxed">
                Saved only in this browser. No account, no server database.
              </p>
            </div>
            {history.length > 0 && (
              <button onClick={handleClearHistory} className="pixel-btn text-[10px] border-grave-blood/60 text-grave-blood hover:bg-grave-blood hover:text-grave-night">
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-grave-ash text-center py-6">
              No saved reports yet. Run an analysis and it will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li key={item.id} className="border border-grave-stone bg-grave-night/50 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-pixel text-xs text-grave-bone truncate mb-2">{item.idea}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-grave-etch">
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                        {item.riskLevel && <span className="pixel-tag border-grave-stone text-grave-ash">RISK {item.riskLevel}</span>}
                        {item.deathScore && <span className="pixel-tag border-grave-blood text-grave-blood">{item.deathScore}/100</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleLoadReport(item)} className="pixel-btn text-[10px]">
                        Open
                      </button>
                      <button
                        onClick={() => handleDeleteReport(item.id)}
                        className="pixel-btn text-[10px] border-grave-blood/60 text-grave-blood hover:bg-grave-blood hover:text-grave-night"
                        aria-label={`Delete ${item.idea}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
