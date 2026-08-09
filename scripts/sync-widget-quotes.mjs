// Regenerates targets/widget/QuoteData.swift from src/data/quotes.ts so the
// WidgetKit extension (which can't import JS) computes the same today's-quote
// mapping as the app. Run after editing the quotes dataset:
//   node scripts/sync-widget-quotes.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const { QUOTES } = await import(path.join(root, "src/data/quotes.ts"));

function swiftString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

const entries = QUOTES.map(
  (q) =>
    `        DailyQuote(month: ${q.month}, day: ${q.day}, en: "${swiftString(q.en)}", ja: "${swiftString(q.ja)}", author: "${swiftString(q.author)}"),`
).join("\n");

const swift = `import Foundation

// GENERATED from ../../src/data/quotes.ts by scripts/sync-widget-quotes.mjs —
// do not edit by hand, run that script again after changing the dataset.
// The widget process can't import JS, so today's quote is computed
// independently here from the same month/day mapping.

struct DailyQuote {
    let month: Int
    let day: Int
    let en: String
    let ja: String
    let author: String
}

enum QuoteStore {
    static let quotes: [DailyQuote] = [
${entries}
    ]

    static func quote(for date: Date = Date()) -> DailyQuote {
        let cal = Calendar.current
        let month = cal.component(.month, from: date)
        let day = cal.component(.day, from: date)
        if let exact = quotes.first(where: { $0.month == month && $0.day == day }) {
            return exact
        }
        if month == 2 && day == 29, let leapFallback = quotes.first(where: { $0.month == 2 && $0.day == 28 }) {
            return leapFallback
        }
        return quotes.first!
    }
}
`;

const outPath = path.join(root, "targets/widget/QuoteData.swift");
await writeFile(outPath, swift, "utf8");
console.log(`Wrote ${QUOTES.length} quotes to targets/widget/QuoteData.swift`);
