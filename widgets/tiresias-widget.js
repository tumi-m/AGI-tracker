// Tiresias — days until AGI · Scriptable home-screen widget (iOS)
//
// Setup:
//   1. Install "Scriptable" (free) from the App Store
//   2. In Scriptable: + new script, paste this file, name it "Tiresias"
//   3. Long-press your home screen → add a Small Scriptable widget
//   4. Long-press the widget → Edit Widget → Script: Tiresias
//
// The widget recomputes locally and refreshes about once an hour.
// Dataset mirrors https://tiresias.io/data/forecasts.json — median of ten
// public forecasts. Edit DATES if the dataset moves.

const DATES = [
  "2027-01-01", "2027-07-01", "2028-01-01", "2028-01-01", "2028-06-20",
  "2030-07-01", "2030-12-31", "2031-01-01", "2033-01-01", "2036-07-01"
];

const times = DATES.map(d => Date.parse(d + "T00:00:00Z")).sort((a, b) => a - b);
const mid = times.length >> 1;
const TARGET = times.length % 2 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
const days = Math.max(0, Math.floor((TARGET - Date.now()) / 86400000));

const w = new ListWidget();
w.backgroundColor = new Color("#f5f4f0");
w.setPadding(14, 16, 14, 16);
w.url = "https://tiresias.io/";

const cap = w.addText("DAYS UNTIL AGI");
cap.font = Font.mediumMonospacedSystemFont(9);
cap.textColor = new Color("#605e57");

w.addSpacer(6);

const num = w.addText(days.toLocaleString());
num.font = Font.lightSystemFont(46);
num.textColor = new Color("#1b1a17");
num.minimumScaleFactor = 0.5;
num.lineLimit = 1;

w.addSpacer(4);

const sub = w.addText("median of 10 forecasts");
sub.font = Font.mediumMonospacedSystemFont(9);
sub.textColor = new Color("#96938a");

w.addSpacer();

const brand = w.addText("TIRESIAS");
brand.font = Font.boldSystemFont(8);
brand.textColor = new Color("#b13f00");

w.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  w.presentSmall();
}
Script.complete();
