/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",
  name: "TodayQuoteWidget",
  displayName: "今日の名言",
  colors: {
    $accent: "#ec3013",
    $widgetBackground: "#eae9e9",
  },
  // containerBackground() is iOS 17+; keep the widget's own deployment target
  // there rather than branching the SwiftUI with availability checks.
  deploymentTarget: "17.0",
};
