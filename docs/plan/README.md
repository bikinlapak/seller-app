# Build Plan v1 — seller-app (frontend)

The SvelteKit PWA for **bikinlapak Seller**: one mobile-first app where a
merchant registers, sets up the shop, manages products and stock, sees reports,
chats with the **Shop Assistant** (PasStok), photographs waste and sends it to the
right destination.

Source of scope: Notion — [Build Plan v1 — bikinlapak Seller app](https://app.notion.com/p/3fa1608449d581d88c2dff0c6d0f0120)
(parent: _PasStok — Forecast, Auto-PO & Waste Reduction (Hackathon)_).
Backend counterpart: [`../../../seller-svc/docs/plan`](../../../seller-svc/docs/plan).

Status: plan, 2026-10-15.

## The one-line architecture

One installable SvelteKit PWA. Every byte of data comes from `seller-svc`, and
only from the server side (`+page.server.ts` → `src/lib/server/seller-svc.ts`) —
the browser never learns the service's address. Mobile-first: the phone layout
is the real design and desktop is the same app with a side panel.

## Documents

| #   | Document                                            | What it settles                                   |
| --- | --------------------------------------------------- | ------------------------------------------------- |
| 00  | [overview.md](00-overview.md)                       | Goal, key decisions, current state of the repo    |
| 01  | [app-map.md](01-app-map.md)                         | Eight modules, every screen, what backs it        |
| 02  | [routing.md](02-routing.md)                         | The SvelteKit route tree and data-loading rules   |
| 03  | [pwa-and-realtime.md](03-pwa-and-realtime.md)       | Install, offline, push, camera, SSE               |
| 04  | [design-system.md](04-design-system.md)             | Tokens, components, Bahasa copy, a11y             |
| 05  | [phases.md](05-phases.md)                           | Phases 0–12 as frontend tasks, with exit criteria |
| 06  | [quality.md](06-quality.md)                         | Definition of done, testing, performance budget   |
| 07  | [risks-and-questions.md](07-risks-and-questions.md) | Risks, mitigations, open questions                |

## Reading order

New to the project: 00 → 01 → 05. Building a screen: 01 for what it must show,
02 for where the file goes, 04 for which component to reuse.
