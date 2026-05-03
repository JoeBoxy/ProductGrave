import {
  formatFundingBillions,
  getPrimaryYear,
  hasCause,
  hasTag,
  parseFundingToBillions,
  type GraveEntry,
} from './graveUtils';

export type CollectionDefinition = {
  title: string;
  eyebrow: string;
  description: string;
  seoDescription: string;
  sort: (a: GraveEntry, b: GraveEntry) => number;
  filter: (grave: GraveEntry) => boolean;
  metric: (grave: GraveEntry) => string;
};

export const collectionDefinitions: Record<string, CollectionDefinition> = {
  'most-expensive-startup-failures': {
    title: 'Most Expensive Startup Failures',
    eyebrow: 'Money Burned',
    description:
      'The costliest burials in Product Grave: companies and products that raised mountains of capital before the market delivered the final invoice.',
    seoDescription:
      'Explore the most expensive startup failures and dead tech products ranked by funding raised before collapse.',
    filter: (grave) => parseFundingToBillions(grave.data.funding_total) > 0,
    sort: (a, b) => parseFundingToBillions(b.data.funding_total) - parseFundingToBillions(a.data.funding_total),
    metric: (grave) => formatFundingBillions(parseFundingToBillions(grave.data.funding_total)),
  },
  'killed-by-google': {
    title: 'Killed by Google',
    eyebrow: 'The Google Graveyard',
    description:
      'A dedicated plot for products built, bought, starved, or buried by Google. Some were too early. Some were unloved. Some were collateral damage in a strategy memo.',
    seoDescription:
      'Browse dead Google products and tech products killed by Google, from Google Reader to Google Glass and beyond.',
    filter: (grave) =>
      grave.data.name.toLowerCase().includes('google') ||
      hasTag(grave, 'google') ||
      hasTag(grave, 'gmail') ||
      hasTag(grave, 'google-plus') ||
      hasTag(grave, 'ex-google'),
    sort: (a, b) => getPrimaryYear(b.data.death) - getPrimaryYear(a.data.death),
    metric: (grave) => `Died ${grave.data.death}`,
  },
  'fastest-startup-deaths': {
    title: 'Fastest Startup Deaths',
    eyebrow: 'Shortest Lives',
    description:
      'The products that speedran the cemetery. These are the shortest-lived graves with enough documented lifespan data to rank fairly.',
    seoDescription:
      'See the fastest startup deaths and shortest-lived tech products in Product Grave.',
    filter: (grave) => Boolean(grave.data.lifespan_months && grave.data.lifespan_months > 0),
    sort: (a, b) => (a.data.lifespan_months || 9999) - (b.data.lifespan_months || 9999),
    metric: (grave) => `${grave.data.lifespan_months} months alive`,
  },
  'most-overhyped-startup-failures': {
    title: 'Most Overhyped Startup Failures',
    eyebrow: 'Hype Crash',
    description:
      'A lineup of products where narrative ran ahead of reality. The pitch decks were loud. The unit economics were not.',
    seoDescription:
      'Explore overhyped startup failures, bubble-era collapses, and tech products killed by hype crashes.',
    filter: (grave) =>
      hasCause(grave, 'hype-crash') ||
      hasTag(grave, 'bubble') ||
      hasTag(grave, 'super-bowl') ||
      hasTag(grave, 'softbank') ||
      hasTag(grave, 'silicon-valley-mockery') ||
      hasTag(grave, 'pre-launch-funding'),
    sort: (a, b) => parseFundingToBillions(b.data.funding_total) - parseFundingToBillions(a.data.funding_total),
    metric: (grave) => grave.data.funding_total || grave.data.stage_at_death,
  },
};

export const collectionSlugs = Object.keys(collectionDefinitions);
