import { z, defineCollection } from 'astro:content';

const graveCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    status: z.enum(['published', 'draft', 'archived']).default('draft'),

    birth: z.string(),
    death: z.string(),
    lifespan_months: z.number().optional(),
    headquarters: z.string().optional(),
    industry: z.string(),
    cause_of_death: z.array(z.string()),
    stage_at_death: z.string(),
    funding_total: z.string().optional(),
    funding_currency: z.string().default('USD'),
    founders: z.array(z.string()).optional(),

    epitaph: z.string(),
    summary: z.string(),

    timeline: z
      .array(
        z.object({
          date: z.string(),
          event: z.string(),
        })
      )
      .optional(),

    lessons: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string(),
        })
      )
      .optional(),

    related: z.array(z.string()).optional(),

    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),

    og_image: z.string().optional(),
  }),
});

export const collections = {
  graves: graveCollection,
};
