# TrueSource Attribution App (prototype)

A click-through prototype of the TrueSource solution for a small hot sauce brand. It runs entirely in the browser (plain HTML, CSS and JavaScript), so it can be hosted free on GitHub Pages.

## Put it on GitHub Pages
1. Create a new public repository on GitHub (for example `truesource-app`).
2. Upload everything in this folder to the repository root (`index.html`, `css`, `js`, `vendor`, `data`, `.nojekyll`). Drag and drop works on the GitHub website: Add file > Upload files.
3. Open Settings > Pages. Under "Build and deployment", choose Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`, then Save.
4. After about a minute the app is live at `https://YOUR-USERNAME.github.io/truesource-app/`. Submit that link.

## How to use it
- No password. On the first page choose a role: Founder, Customer or Channel Partner.
- Founder: Dashboard, Tag Builder, Orders and Data Flow, Budget Advisor, Seasonal Planner, Loyalty Radar, Tutorial.
- Customer: pick how the customer arrived (ad link, creator link, market QR, referral, or no tag), then check out.
- Partner: pick a partnership to see its link, QR code, promo code and credited orders.
- Customers can also open a tracking link directly, for example `.../#/shop?utm_source=paid_social&utm_medium=paid&utm_campaign=CMP-SOC-01&promo=SOCIAL10`.

## What is inside
- `data/baseline-data.js`: Dataset 1 (2,500 synthetic orders, the current state).
- `js/core.js`: capture layer, channel resolver, KPI engine, Budget Advisor rules.
- `js/views.js`: the screens for each role.
- `vendor/`: Chart.js 4.4.0 and qrcode-generator (both MIT licensed), bundled so the app works offline.

## Notes
- All data is synthetic. Orders placed in the app are saved only in the visitor's own browser (localStorage).
- The Budget Advisor gives guidance only. It never promises results or exact budget amounts.
