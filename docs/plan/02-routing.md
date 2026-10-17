# 02 — Routing and data loading

> **Revised 2026-10-15** against the design canvas. The route tree below is what
> is on disk, not a proposal; routes marked ○ are not built yet.

## Route tree

```plain text
src/routes/
  +layout.svelte                       ✓ global: layout.css, lang="id"
  +page.server.ts                      ✓ redirect → /assistant
  layout.css                           ✓ design tokens from the canvas

  (app)/
    +layout.svelte                     ✓ AppShell; hides the bar inside a thread
    ○ +layout.server.ts                   session guard → redirect /sign-in

    assistant/+page.svelte             ✓ B0 assistant home
    assistant/+page.server.ts          ✓ GET /v1/home
    assistant/[topic]/+page.svelte     ✓ B1–B9, one route, nine threads
    assistant/[topic]/+page.server.ts  ✓ thread + actions: act, reject, send

    products/+page.svelte              ✓ C2 list: search, category, stock
    products/+page.server.ts           ✓ GET /v1/products
    ○ products/new, products/[id]         C3 form, photo-to-listing

    stock/+page.svelte                 ✓ C4: summary, filters, rows
    stock/+page.server.ts              ✓ GET /v1/stock
    ○ stock/[id]                          C5 lots, history, orders

    shop/+page.svelte                  ✓ C1, thin: links into /assistant/shop
    me/+page.svelte                    ✓ C6 AI settings
    me/+page.server.ts                 ✓ GET /v1/assistant/settings

  ○ (auth)/ masuk · daftar · verifikasi · buat-toko      A2–A5
  ○ (public)/ +page.svelte                               A1 selamat datang
```

One `[topic]` route serves all nine threads. The thread shape is identical
across them — header, message list, composer — and only the content differs, so
nine routes would be nine copies of the same file.

## Data loading

**Server-side only.** Every call to seller-svc goes through
`src/lib/server/api/` from a `+page.server.ts` or a form action. Nothing fetches
it from the browser, so the service address and the merchant's worksh.io token
never reach the client.

```plain text
src/lib/server/api/
  http.ts        get() · post() · the mock switch · fetchHealth()
  assistant.ts     home() · thread() · runAction()
  catalogue.ts     products() · stock() · aiSettings()
```

**The mock switch.** `SELLER_SVC_MOCK` (default `true`) makes `get`/`post`
return fixtures from `src/lib/mock/fixtures.ts` without touching the network.
The real path is written and unused, not absent: when seller-svc stops
answering 501, set the flag to `false` and the same functions call it. Fixtures
are seeded from the canvas's own content — Toko Kopi Jasa, Kopi Arabika,
PO-0771, CV Sumber Kopi — so the running app looks like the design.

**Forms, not client fetch.** Mutations are SvelteKit form actions with
`use:enhance`. A reorder approval has to survive a bad connection, and a native
form POST the server handles is the most reliable version of that. Each form
instance generates one `Idempotency-Key`, so a double tap cannot create two
purchase orders.

**Degradation.** `get` returns `null` on failure rather than throwing; the
page renders a quiet retry. A page goes to an error boundary only when its
primary resource is missing.

**Types.** `src/lib/types/api.ts` mirrors the backend contract by hand — the two
repos cannot share a schema at compile time. `src/lib/mock/fixtures.spec.ts` is
the contract test: it asserts the fixtures still satisfy those types and the
rules that matter (expired items offer no donation, `Discard` is never
preselected, exactly one destination preselected per item, bar percentages in
range). A renamed field fails there first.

## Still to wire

- **`(app)/+layout.server.ts` session guard** — the app currently has no auth,
  so every route is open. This is the first thing Phase 1 adds.
- **SSE.** The thread renders action results returned by the form action, which
  is enough to make approve → result card work end to end. The live channel
  (`GET /v1/assistant/stream`, shared `EventSource`, `Last-Event-ID` resume,
  `resync` → `invalidate`) is Phase 6 and replaces nothing — it adds the
  unsolicited card arriving while the merchant is elsewhere.
- **Camera.** `/assistant/waste` renders a photo that is already in the thread. The
  capture path (`getUserMedia`, file-input fallback, EXIF strip, resize, signed
  URL upload) is Phase 7.
