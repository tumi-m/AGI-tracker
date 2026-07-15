/* Tiresias badge — recomputes the countdown locally from the bundled dataset. */
"use strict";
const DATES = [
  "2027-01-01", "2027-07-01", "2028-01-01", "2028-01-01", "2028-06-20",
  "2030-07-01", "2030-12-31", "2031-01-01", "2033-01-01", "2036-07-01"
];
const times = DATES.map(d => Date.parse(d + "T00:00:00Z")).sort((a, b) => a - b);
const mid = times.length >> 1;
const TARGET = times.length % 2 ? times[mid] : (times[mid - 1] + times[mid]) / 2;

function update(){
  const days = Math.max(0, Math.floor((TARGET - Date.now()) / 86400000));
  chrome.action.setBadgeText({ text: String(days) });
  chrome.action.setBadgeBackgroundColor({ color: "#1b1a17" });
  chrome.action.setBadgeTextColor({ color: "#f5f4f0" });
  chrome.action.setTitle({ title: `Tiresias — ${days.toLocaleString()} days until AGI (median of 10 forecasts)` });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("tick", { periodInMinutes: 60 });
  update();
});
chrome.runtime.onStartup.addListener(update);
chrome.alarms.onAlarm.addListener(update);
update();
