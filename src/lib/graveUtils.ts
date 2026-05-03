import type { CollectionEntry } from 'astro:content';

export type GraveEntry = CollectionEntry<'graves'>;

export function parseFundingToBillions(value?: string): number {
  if (!value) return 0;

  const normalized = value.trim().toUpperCase().replace(/,/g, '');
  const amount = parseFloat(normalized.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(amount)) return 0;
  if (normalized.includes('B')) return amount;
  if (normalized.includes('M')) return amount / 1000;
  if (normalized.includes('K')) return amount / 1_000_000;

  return amount / 1_000_000_000;
}

export function formatFundingBillions(value: number): string {
  if (value >= 1) return `$${value.toFixed(value >= 10 ? 1 : 2)}B`;
  return `$${Math.round(value * 1000)}M`;
}

export function getPrimaryYear(date: string): number {
  const year = Number(date.slice(0, 4));
  return Number.isNaN(year) ? 0 : year;
}

export function hasTag(grave: GraveEntry, tag: string): boolean {
  return Boolean(grave.data.tags?.includes(tag));
}

export function hasCause(grave: GraveEntry, cause: string): boolean {
  return grave.data.cause_of_death.includes(cause);
}
