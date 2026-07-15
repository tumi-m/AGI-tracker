/*!
 * AGI Tracker — script embed
 * Usage:
 *   <div data-agi-tracker data-source="agg" data-units="days,hrs"></div>
 *   <script async src="https://agitracker.io/widget.js"></script>
 *
 * data-source : agg | amodei | aschenbrenner | altman | manifold |
 *               metaculus-weak | kokotajlo | hassabis | polymarket |
 *               metaculus | lecun            (default: agg)
 * data-units  : comma list of days,hrs,min,sec (default: days)
 * data-label  : 0 to hide the "until AGI" label (attribution stays)
 *
 * The widget inherits the host page's font. Targets mirror
 * https://agitracker.io/data/forecasts.json (the canonical dataset).
 */
(function () {
  "use strict";

  var T = {
    amodei: ["Dario Amodei", "2027-01-01"],
    aschenbrenner: ["Leopold Aschenbrenner", "2027-07-01"],
    altman: ["Sam Altman", "2028-01-01"],
    manifold: ["Manifold Markets", "2028-01-01"],
    "metaculus-weak": ["Metaculus (weak AGI)", "2028-06-20"],
    kokotajlo: ["Daniel Kokotajlo", "2030-07-01"],
    hassabis: ["Demis Hassabis", "2030-12-31"],
    polymarket: ["Polymarket", "2031-01-01"],
    metaculus: ["Metaculus (full AGI)", "2033-01-01"],
    lecun: ["Yann LeCun", "2036-07-01"]
  };
  var UNITS = { days: 86400000, hrs: 3600000, min: 60000, sec: 1000 };
  var ALIAS = { hours: "hrs", minutes: "min", seconds: "sec", d: "days", h: "hrs", m: "min", s: "sec" };

  function ts(d) { return Date.parse(d + "T00:00:00Z"); }

  var all = Object.keys(T).map(function (k) { return ts(T[k][1]); }).sort(function (a, b) { return a - b; });
  var mid = Math.floor(all.length / 2);
  var AGG = all.length % 2 ? all[mid] : (all[mid - 1] + all[mid]) / 2;

  function mount(el) {
    var srcId = el.getAttribute("data-source") || "agg";
    if (srcId !== "agg" && !T[srcId]) srcId = "agg";
    var target = srcId === "agg" ? AGG : ts(T[srcId][1]);
    var name = srcId === "agg" ? "expert median" : T[srcId][0];
    var units = (el.getAttribute("data-units") || "days").split(",")
      .map(function (u) { u = u.trim(); return ALIAS[u] || u; })
      .filter(function (u) { return UNITS[u]; });
    if (!units.length) units = ["days"];
    var showLabel = el.getAttribute("data-label") !== "0";

    el.style.cssText += ";display:inline-flex;align-items:baseline;gap:.45em;font-variant-numeric:tabular-nums;line-height:1.3;";
    var spans = {};
    units.forEach(function (u) {
      var b = document.createElement("b");
      b.style.cssText = "font-weight:700;";
      var s = document.createElement("span");
      s.textContent = u;
      s.style.cssText = "font-size:.62em;opacity:.6;letter-spacing:.12em;text-transform:uppercase;";
      el.appendChild(b); el.appendChild(s);
      spans[u] = b;
    });
    if (showLabel) {
      var lab = document.createElement("span");
      lab.textContent = "until AGI (" + name + ")";
      lab.style.cssText = "font-size:.78em;opacity:.7;";
      el.appendChild(lab);
    }
    var attr = document.createElement("a");
    attr.href = "https://agitracker.io/?source=" + srcId;
    attr.target = "_blank"; attr.rel = "noopener";
    attr.textContent = "agitracker.io";
    attr.style.cssText = "font-size:.6em;opacity:.45;text-decoration:none;color:inherit;letter-spacing:.06em;";
    el.appendChild(attr);

    var hasSec = units.indexOf("sec") !== -1;
    function render() {
      var diff = target - Date.now();
      if (diff <= 0) {
        el.textContent = "AGI forecast window closed (" + name + ") ";
        el.appendChild(attr);
        return;
      }
      units.forEach(function (u) {
        var v = Math.floor(diff / UNITS[u]);
        diff -= v * UNITS[u];
        var txt = u === "days" ? v.toLocaleString() : String(v < 10 ? "0" + v : v);
        if (spans[u].textContent !== txt) spans[u].textContent = txt;
      });
      setTimeout(render, hasSec ? 250 : 30000);
    }
    render();
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-agi-tracker]:not([data-agi-mounted])");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("data-agi-mounted", "1");
      mount(nodes[i]);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
