// Tiresias — days until AGI · Scriptable home-screen widget (iOS)
//
// Setup (one time):
//   1. Install "Scriptable" (free) from the App Store
//   2. In Scriptable: + new script, paste this file, name it "Tiresias"
//   3. Long-press your home screen → Edit → Add Widget → search "Scriptable"
//   4. Pick a size — Small, Medium or Large all work — and add it
//   5. Long-press the new widget → Edit Widget → Script: Tiresias
//
// "Resizing": iOS widgets come in fixed sizes; add the size you want and
// this script adapts its layout — Small shows the count, Medium adds the
// target date, Large adds the individual forecasts.
//
// Refreshes about once an hour. Dataset mirrors
// https://tiresias.io/data/forecasts.json — median of ten public forecasts.

const FORECASTS = [
  ["Dario Amodei",        "2027-01-01"],
  ["Leopold Aschenbrenner","2027-07-01"],
  ["Sam Altman",          "2028-01-01"],
  ["Manifold",            "2028-01-01"],
  ["Metaculus (weak)",    "2028-06-20"],
  ["Daniel Kokotajlo",    "2030-07-01"],
  ["Demis Hassabis",      "2030-12-31"],
  ["Polymarket",          "2031-01-01"],
  ["Metaculus (full)",    "2033-01-01"],
  ["Yann LeCun",          "2036-07-01"]
];

const PAPER = new Color("#f5f4f0");
const INK   = new Color("#1b1a17");
const INK2  = new Color("#605e57");
const INK3  = new Color("#96938a");
const RUST  = new Color("#b13f00");

const times = FORECASTS.map(f => Date.parse(f[1] + "T00:00:00Z")).sort((a, b) => a - b);
const mid = times.length >> 1;
const TARGET = times.length % 2 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
const daysTo = t => Math.max(0, Math.floor((t - Date.now()) / 86400000));
const days = daysTo(TARGET);
const targetStr = new Date(TARGET).toISOString().slice(0, 10);

const fam = (typeof config !== "undefined" && config.widgetFamily) || "small";
const w = new ListWidget();
w.backgroundColor = PAPER;
w.url = "https://tiresias.io/";

function cap(text, size) {
  const t = w.addText(text.toUpperCase());
  t.font = Font.mediumMonospacedSystemFont(size);
  t.textColor = INK2;
  return t;
}

if (fam === "small") {
  w.setPadding(14, 16, 14, 16);
  cap("Days until AGI", 9);
  w.addSpacer(6);
  const num = w.addText(days.toLocaleString());
  num.font = Font.lightSystemFont(46);
  num.textColor = INK;
  num.minimumScaleFactor = 0.5;
  num.lineLimit = 1;
  w.addSpacer(4);
  const sub = w.addText("median of 10 forecasts");
  sub.font = Font.mediumMonospacedSystemFont(9);
  sub.textColor = INK3;
  w.addSpacer();
  const brand = w.addText("TIRESIAS");
  brand.font = Font.boldSystemFont(8);
  brand.textColor = RUST;

} else if (fam === "medium") {
  w.setPadding(16, 20, 16, 20);
  const row = w.addStack();
  row.layoutVertically = false;
  row.centerAlignContent();

  const left = row.addStack();
  left.layoutVertically = true;
  const c = left.addText("DAYS UNTIL AGI");
  c.font = Font.mediumMonospacedSystemFont(10);
  c.textColor = INK2;
  left.addSpacer(4);
  const num = left.addText(days.toLocaleString());
  num.font = Font.lightSystemFont(58);
  num.textColor = INK;
  num.minimumScaleFactor = 0.5;
  num.lineLimit = 1;

  row.addSpacer();

  const right = row.addStack();
  right.layoutVertically = true;
  const facts = [
    ["MEDIAN", targetStr],
    ["EARLIEST", FORECASTS[0][1].slice(0, 4)],
    ["LATEST", FORECASTS[FORECASTS.length - 1][1].slice(0, 4)],
    ["SOURCES", String(FORECASTS.length)]
  ];
  for (const [k, v] of facts) {
    const r = right.addStack();
    const kk = r.addText(k + "  ");
    kk.font = Font.mediumMonospacedSystemFont(9);
    kk.textColor = INK3;
    r.addSpacer();
    const vv = r.addText(v);
    vv.font = Font.boldMonospacedSystemFont(10);
    vv.textColor = INK;
    right.addSpacer(3);
  }
  w.addSpacer();
  const brand = w.addText("TIRESIAS · median of 10 public forecasts");
  brand.font = Font.boldSystemFont(8);
  brand.textColor = RUST;

} else { /* large */
  w.setPadding(18, 20, 16, 20);
  cap("Days until AGI", 10);
  w.addSpacer(2);
  const num = w.addText(days.toLocaleString());
  num.font = Font.lightSystemFont(56);
  num.textColor = INK;
  num.minimumScaleFactor = 0.5;
  num.lineLimit = 1;
  const sub = w.addText("median of 10 forecasts · " + targetStr);
  sub.font = Font.mediumMonospacedSystemFont(9);
  sub.textColor = INK3;
  w.addSpacer(10);

  const shown = [0, 2, 5, 6, 9]; /* Amodei, Altman, Kokotajlo, Hassabis, LeCun */
  for (const i of shown) {
    const [name, date] = FORECASTS[i];
    const r = w.addStack();
    r.centerAlignContent();
    const n = r.addText(name);
    n.font = Font.mediumSystemFont(11);
    n.textColor = INK2;
    r.addSpacer();
    const d = r.addText(daysTo(Date.parse(date + "T00:00:00Z")).toLocaleString() + " d");
    d.font = Font.boldMonospacedSystemFont(11);
    d.textColor = INK;
    w.addSpacer(6);
  }
  w.addSpacer();
  const brand = w.addText("TIRESIAS — SEER OF THEBES");
  brand.font = Font.boldSystemFont(8);
  brand.textColor = RUST;
}

w.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

if (typeof config !== "undefined" && config.runsInWidget) {
  Script.setWidget(w);
} else {
  if (fam === "large") await w.presentLarge();
  else if (fam === "medium") await w.presentMedium();
  else await w.presentSmall();
}
Script.complete();
