"use strict";
const DATES = [
  "2027-01-01", "2027-07-01", "2028-01-01", "2028-01-01", "2028-06-20",
  "2030-07-01", "2030-12-31", "2031-01-01", "2033-01-01", "2036-07-01"
];
const times = DATES.map(d => Date.parse(d + "T00:00:00Z")).sort((a, b) => a - b);
const mid = times.length >> 1;
const TARGET = times.length % 2 ? times[mid] : (times[mid - 1] + times[mid]) / 2;

function tick(){
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  let r = diff % 86400000;
  const h = String(Math.floor(r / 3600000)).padStart(2, "0"); r %= 3600000;
  const m = String(Math.floor(r / 60000)).padStart(2, "0"); r %= 60000;
  const s = String(Math.floor(r / 1000)).padStart(2, "0");
  document.getElementById("d").textContent = d.toLocaleString();
  document.getElementById("s").textContent = `${h}:${m}:${s} · median of 10 forecasts`;
}
tick();
setInterval(tick, 250);
