import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> QuoteEntry {
        QuoteEntry(date: Date(), quote: QuoteStore.quote())
    }

    func getSnapshot(in context: Context, completion: @escaping (QuoteEntry) -> Void) {
        completion(QuoteEntry(date: Date(), quote: QuoteStore.quote()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuoteEntry>) -> Void) {
        let now = Date()
        let entry = QuoteEntry(date: now, quote: QuoteStore.quote(for: now))
        // Next refresh just after local midnight, when the day (and quote) changes.
        let calendar = Calendar.current
        let nextMidnight = calendar.nextDate(
            after: now, matching: DateComponents(hour: 0, minute: 1),
            matchingPolicy: .nextTime
        ) ?? now.addingTimeInterval(86_400)
        completion(Timeline(entries: [entry], policy: .after(nextMidnight)))
    }
}

struct QuoteEntry: TimelineEntry {
    let date: Date
    let quote: DailyQuote
}

private let inkColor = Color(red: 32.0 / 255.0, green: 30.0 / 255.0, blue: 29.0 / 255.0)
private let brandAccent = Color(red: 236.0 / 255.0, green: 48.0 / 255.0, blue: 19.0 / 255.0)
private let accent700 = Color(red: 174.0 / 255.0, green: 24.0 / 255.0, blue: 0.0 / 255.0)
private let surfaceColor = Color(red: 234.0 / 255.0, green: 233.0 / 255.0, blue: 233.0 / 255.0)

private struct WidgetLabel: View {
    var body: some View {
        Text("今日の名言")
            .font(.system(size: 9, weight: .semibold))
            .tracking(1.1)
            .foregroundStyle(accent700)
    }
}

/// Shared chrome: the red top rule and the paper background. Every family's
/// content view wraps its body in this.
private struct WidgetFrame<Content: View>: View {
    let padding: CGFloat
    @ViewBuilder let content: Content

    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .overlay(alignment: .top) {
                // Named brandAccent (not accentColor) because SwiftUI's
                // deprecated View.accentColor(_:) modifier shadows a bare
                // `let accentColor` inside a View's body -- unqualified
                // lookup resolves to the instance method's curried
                // reference instead, which broke earlier attempts here.
                brandAccent.frame(height: 3)
            }
            .containerBackground(surfaceColor, for: .widget)
    }
}

private struct SmallQuoteView: View {
    let quote: DailyQuote

    var body: some View {
        WidgetFrame(padding: 12) {
            VStack(alignment: .leading, spacing: 4) {
                WidgetLabel()
                Text("\u{201C}\(quote.en)\u{201D}")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundStyle(inkColor)
                    .lineLimit(5)
                    .minimumScaleFactor(0.85)
                Spacer(minLength: 4)
                Text("— \(quote.author)")
                    .font(.system(size: 10))
                    .foregroundStyle(inkColor.opacity(0.6))
            }
        }
    }
}

private struct MediumQuoteView: View {
    let quote: DailyQuote

    var body: some View {
        WidgetFrame(padding: 12) {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    WidgetLabel()
                    Text("\u{201C}\(quote.en)\u{201D}")
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundStyle(inkColor)
                        .lineLimit(4)
                        .minimumScaleFactor(0.8)
                    Spacer(minLength: 2)
                    Text("— \(quote.author)")
                        .font(.system(size: 9))
                        .foregroundStyle(inkColor.opacity(0.6))
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)

                brandAccent.opacity(0.35).frame(width: 2)

                Text(quote.ja)
                    .font(.system(size: 12))
                    .foregroundStyle(inkColor.opacity(0.85))
                    .lineLimit(5)
                    .minimumScaleFactor(0.8)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
    }
}

private struct LargeQuoteView: View {
    let quote: DailyQuote

    var body: some View {
        WidgetFrame(padding: 16) {
            VStack(alignment: .leading, spacing: 8) {
                WidgetLabel()
                Text("\u{201C}\(quote.en)\u{201D}")
                    .font(.system(size: 20, weight: .bold, design: .rounded))
                    .foregroundStyle(inkColor)
                    .lineLimit(6)
                    .minimumScaleFactor(0.7)
                brandAccent.opacity(0.3).frame(height: 1)
                Text(quote.ja)
                    .font(.system(size: 15))
                    .foregroundStyle(inkColor.opacity(0.85))
                    .lineLimit(4)
                    .minimumScaleFactor(0.75)
                Spacer(minLength: 4)
                Text("— \(quote.author)")
                    .font(.system(size: 12))
                    .foregroundStyle(inkColor.opacity(0.6))
            }
        }
    }
}

struct TodayQuoteWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: Provider.Entry

    var body: some View {
        switch family {
        case .systemMedium:
            MediumQuoteView(quote: entry.quote)
        case .systemLarge:
            LargeQuoteView(quote: entry.quote)
        default:
            SmallQuoteView(quote: entry.quote)
        }
    }
}

struct TodayQuoteWidget: Widget {
    let kind: String = "TodayQuoteWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TodayQuoteWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("今日の名言")
        .description("今日の英語名言をホーム画面に表示します。")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemSmall) {
    TodayQuoteWidget()
} timeline: {
    QuoteEntry(date: .now, quote: QuoteStore.quote())
}

#Preview(as: .systemMedium) {
    TodayQuoteWidget()
} timeline: {
    QuoteEntry(date: .now, quote: QuoteStore.quote())
}

#Preview(as: .systemLarge) {
    TodayQuoteWidget()
} timeline: {
    QuoteEntry(date: .now, quote: QuoteStore.quote())
}
