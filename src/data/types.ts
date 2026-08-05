export interface Quote {
  /** Stable id, "MM-DD" zero-padded, e.g. "01-01", "12-31". */
  id: string;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
  /** The English quote text, without surrounding quote marks. */
  en: string;
  /** Attribution, e.g. "Confucius", "Chinese Proverb". */
  author: string;
  /** Natural Japanese translation of `en`. */
  ja: string;
  /** Short Japanese memo explaining one English word/grammar point in the quote. */
  note: string;
}
