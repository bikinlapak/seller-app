# 00 — Overview and key decisions

## Goal

One mobile-first app, **bikinlapak Seller**, where a merchant registers, sets up
the shop, manages products and stock, sees reports, chats with the Shop Assistant
(PasStok), photographs waste and sends it to the right destination.

This document covers the frontend half. The backend plan lives in
[`../../../seller-svc/docs/plan`](../../../seller-svc/docs/plan).

## Key decisions

| Decision           | Choice                                                                                                         | Why                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| One app or several | **One SvelteKit PWA**, installable, mobile-first; desktop gets the same app with a side-panel layout           | No app-store wall; same code for phone and laptop; push works via Web Push               |
| Framework          | SvelteKit 3, Svelte 5 runes, `adapter-node`                                                                    | Already in the repo; server-side load and sessions rule out a static adapter             |
| Styling            | Tailwind CSS 4, tokens shared with `../comingsoon`                                                             | One brand across the public site and the dashboard                                       |
| Data access        | Only from the server side, via `src/lib/server/seller-svc.ts`                                                  | Keeps the internal service address and the merchant's worksh.io token out of the browser |
| Env vars           | SvelteKit 3 `defineEnvVars` in `src/env.ts`, imported from `$app/env/private`                                  | `$env/*` no longer exists in SvelteKit 3                                                 |
| Imports            | `#lib/*` Node subpath imports with a `.js` specifier                                                           | Repo convention, not `$lib`                                                              |
| Language           | **English throughout**: copy, comments, identifiers and the API contract. Indonesian stays a selectable option | Decided 2026-10-16; diverges from `../comingsoon` on purpose                             |
| Realtime           | SSE from `seller-svc`, consumed in the browser                                                                 | Simpler than WebSockets; works through proxies                                           |
| Offline            | App shell + last-read thread cached; writes queued, never silently replayed                                    | A warung's connection drops; a _purchase order_ must not fire twice                      |

## The design canvas changed this plan

On 2026-10-15 a design canvas landed — _bikinlapak Seller App Funnel_, 21
artboards at 390×844, grouped in three rows. Its row-B title states the
architecture outright: **"Asisten Lapak — chat sebagai inti: semua fitur lewat
percakapan."** Chat is the core; every feature goes through conversation.

That is a different app from the one the Notion page implies, and the canvas
wins — it is the more considered artefact, and it is what the team drew. What
changed:

| First planned from Notion                               | The canvas, and what is now built                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A `Home` screen, Assistant as one module of eight       | **`/assistant` is home.** There is no separate home screen                           |
| Bottom nav: Home · Products · Orders · Assistant · More | **Assistant · Products · Stock · Shop · Me**                                         |
| Orders and Reports as list screens                      | **Threads** (`ChatPesan`, `ChatLaporan`) — you discuss a PO, you don't administer it |
| Composer only inside the assistant                      | **Composer on the home screen too**, and on every thread                             |
| Camera behind a FAB on two screens                      | **Camera in the composer**, so it is one tap from anywhere                           |
| Display font Plus Jakarta Sans                          | **Young Serif** for display; Figtree stays for body                                  |
| No AI settings screen                                   | **C6 AI settings** — mode, model per task, autonomy, cost cap, privacy               |

The eight-module table from the Notion page is still a fair description of the
_capabilities_. It is no longer a description of the _navigation_. See
[01-app-map.md](01-app-map.md).

## Mobile-first, concretely

Not a slogan — it decides layout work. The target is a mid-range Android on a
venue or warung network, held one-handed behind a counter:

- Design at 360 px wide first; the desktop side panel is the adaptation.
- Bottom navigation on phones (thumb reach), sidebar from `md:` up.
- 44 px minimum touch targets, including the quantity stepper on a reorder card.
- One request per screen — the backend returns screen-shaped aggregates, so a
  page does not fan out six fetches.
- Every action has a visible pending state. A 6-second vision call with no
  feedback reads as a broken app.

## Current state of this repo (2026-10-15)

Built and running against mock data (`npm run dev`, no backend needed):

- **Shell** — `AppShell` (430px max, centred), `BottomNav` (the canvas's five),
  `Composer`, `ChatHeader`, `Icon` (the canvas's stroke set, no emoji).
- **Chat** — `Thread` switching over every card type with a plain-text fallback
  for unknown ones, `Bubble`, `PhotoMessage` with detection boxes, `AgentMeta`,
  `SystemNote`, `SuggestionCard` (stepper capped at the proposed quantity),
  `ResultCard`, `WasteCard` (condition-filtered destinations).
- **Routes** — `/assistant`, `/assistant/[topic]` (nine threads), `/products`,
  `/stock`, `/shop` (thin), `/me` (AI settings). `/` → `/assistant`.
- **Data** — `src/lib/types/api.ts` (contract), `src/lib/mock/fixtures.ts`
  (seeded from the canvas), `src/lib/server/api/` with the `SELLER_SVC_MOCK`
  switch.
- **Tokens** — `src/routes/layout.css`, extended from the canvas: Young Serif,
  the warm danger family, surface/line/chip greys, bubble shapes.
- **Tests** — 22 passing: fixture contract rules and the thread form actions.

Not built yet: auth and onboarding (row A), the SSE channel, camera capture,
product and stock detail. See [05-phases.md](05-phases.md).

## Hackathon cut line

Phases 0–8 are the demo build (every P0 in the PRD). Phase 9 is demo hardening.
Phases 10–12 are after the hackathon. The deadline is not recorded yet, so
phases are ordered by dependency, each sized S (≤1 day), M (2–3 days) or
L (4–5 days) for one engineer. See [05-phases.md](05-phases.md).

## The demo path

Within every phase, build the screens the 7-minute demo touches before the ones
that merely complete the product. The path, in canvas terms:

1. **B0 Assistant** — _Needs attention today_: "Arabica beans run out Thursday."
2. **B3 Reorder suggestion** — the reorder card; the merchant asks "why 12?",
   gets a grounded answer, edits to 9 kg, taps _Approve_.
3. **Result card** — PO-0771, with _Send via WhatsApp_.
4. **B5 Waste photo** — photograph the tray; items come back outlined with
   confidence.
5. **Destinations** — donation, daily special, compost; landfill never default.
6. **B8 Reports** — the diversion score moves.

Six screens. They get built first, and they get the Playwright test.
Steps 1–3 and 4–5 are built and running against mock data today.
