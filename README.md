# AGI Tracker

A live, embeddable countdown to artificial general intelligence — a national-debt-clock for the AI era. One transparent data layer (named expert forecasts + prediction-market medians), many surfaces: the site, an iframe embed, a script widget, badges, and a JSON dataset.

Built for developers, engineers, AI researchers and enthusiasts: minimal, dark, dense with live numbers, zero dependencies, zero build step.

## What is in here

| File | Purpose |
|---|---|
| `index.html` | The canonical clock. Six switchable clock views (seer / split-flap / LED / HUD / dial / grammaton), forecast table with expandable sources, divergence timeline, widget & install section, integration docs. Fully self-contained — no build, no external requests. |
| `resources.html` | Context page: Economy = Debt + Productivity + Demographics with live counters and sparklines, scenario chart, compute & forecast-drift charts, curated free library. |
| `embed.html` | Embeddable clock. Parameterized via query string (see below). |
| `widget.js` | Script embed — renders inline and inherits the host page's font. |
| `manifest.webmanifest` + `sw.js` + `icons/` | PWA layer: installable on phone / tablet / desktop, offline app shell. |
| `widgets/tiresias-widget.js` | Scriptable script — a real iOS home-screen widget without an app store listing. |
| `extension/` + `downloads/tiresias-extension.zip` | MV3 browser extension: days-remaining badge on the toolbar. Load unpacked; no permissions beyond an alarm. |
| `data/forecasts.json` | The canonical dataset: every forecast with claim, kind, primary-source links, verification stamp and revision history. Edits happen via PR, which is the audit trail. |

## Run it

It is a static site. Open `index.html` in a browser, or serve the repo root:

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Deploy by pointing GitHub Pages, Cloudflare Pages, Vercel or Netlify at the repo root. No build step.

## Embed it

**iframe** (blogs, Substack, WordPress, Webflow, OBS overlays):

```html
<iframe src="https://agitracker.io/embed?source=agg&theme=dark&units=days,hrs,min,sec"
        width="100%" height="180" frameborder="0" title="AGI Countdown"></iframe>
```

Params: `source` (agg, amodei, aschenbrenner, altman, manifold, metaculus-weak, kokotajlo, hassabis, polymarket, metaculus, lecun) · `theme` (dark/light) · `units` (comma list of days,hrs,min,sec) · `compact=1` (single-line strip) · `transparent=1` (stream overlays, wallpapers).

**Script embed** (inherits your styles):

```html
<div data-agi-tracker data-source="amodei" data-units="days,hrs"></div>
<script async src="https://agitracker.io/widget.js"></script>
```

**Data** — fetch `data/forecasts.json` once, compute the countdown locally. The target date changes rarely; clients need no polling.

**Deep links** — `index.html?source=kokotajlo` selects a forecaster; every share URL carries the selection.

## Methodology

- The headline clock is the **median of all tracked forecast dates**, recomputed at page load from the dataset. No secret sauce.
- Forecast dates are **editorial interpretations of public statements** and community medians — labeled as such, each linked to its primary source with a last-verified stamp.
- Revisions are content: when a forecaster moves, the change lands in the dataset's `history` array via PR.
- Expired forecasts stay on the board ("window closed") — history will judge.

## Updating forecasts

1. Edit `data/forecasts.json` (and the mirrored `FORECASTS` constant in `index.html`, plus the target tables in `embed.html` / `widget.js`).
2. Append the old value to the forecast's `history` array with the date of the change.
3. A `source_url` is required for any named-expert change — never publish an interpretation without the primary source.
4. Open a PR; the merged diff is the public changelog entry.

Structured sources (Metaculus, Manifold, Polymarket) can later be polled by a scheduled job that opens the PR automatically; named experts change via essays and interviews and stay manual by design.

## Roadmap

- **v1** — OG social-card generation (`/v1/card/:id.png`), SVG badge endpoint (`/v1/badge/:id.svg`), edge JSON API (`/v1/countdown/:id`).
- **v2** — X bot: daily count, milestone and revision alerts.
- **v3** — revision-history charts, ASI second clock if demanded.

## Disclaimer

Forecast dates are midpoints of wide, shifting probability distributions — not promises. Definitions of AGI differ substantially between sources. The site takes no position on whose timeline is right; the disagreement is the point.
