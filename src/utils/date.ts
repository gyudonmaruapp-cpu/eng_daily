import { QUOTES } from "../data/quotes";
import type { Quote } from "../data/types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "MM-DD" for a given Date, in local device time. */
export function dateKey(date: Date): string {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

const quotesById = new Map(QUOTES.map((q) => [q.id, q]));

/**
 * Looks up the quote for a given calendar date by month/day (year-agnostic,
 * so the same 365-day set repeats every year). Feb 29 has no entry of its
 * own — falls back to Feb 28 so leap years don't break the lookup.
 */
export function quoteForDate(date: Date): Quote | undefined {
  const key = dateKey(date);
  return quotesById.get(key) ?? (key === "02-29" ? quotesById.get("02-28") : undefined);
}

export function quoteById(id: string): Quote | undefined {
  return quotesById.get(id);
}

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

/** "2026年8月5日・水曜日" */
export function formatJapaneseDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日・${WEEKDAYS_JA[date.getDay()]}曜日`;
}

/** "8/5" for archive/list rows. */
export function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** 1-366 ordinal day of year, for the "DAY 218" tag. */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000) + 1;
}

/** Start-of-day Date, local time — use as a stable key for "today". */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
