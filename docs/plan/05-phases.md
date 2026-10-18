# 05 — Phased plan (frontend)

Phase numbers match the Notion build plan and the
[backend plan](../../../seller-svc/docs/plan/05-phases.md), so a phase is a joint
milestone: `seller-app` Phase 2 and `seller-svc` Phase 2 ship together.

**Hackathon cut line:** Phases 0–8 are the demo build (every P0 in the PRD).
Phase 9 is demo hardening. Phases 10–12 are after the hackathon. The deadline is
not recorded yet, so phases are ordered by dependency, each sized S (≤1 day),
M (2–3 days) or L (4–5 days) for one engineer.

Within a phase, build the demo-path screens
([00-overview.md](00-overview.md)) before the rest.

> **Progress, 2026-10-18.** The app now runs on seller-svc's PasStok engine
> (no mocks needed; `SELLER_SVC_MOCK` still works offline). Built and
> verified in a browser: computed assistant home; reorder cards (single and
> grouped by supplier, multi-line editing) → approve / edit / reject → result
> card; grounded Q&A with inline order buttons; expiry markdown; daily
> special; waste photo (camera input, on-device re-encode so EXIF never
> leaves the phone) → editable counts, destinations and "which product?" →
> write-off; donation card with the checklist as a hard gate → PDF receipt;
> SSE-driven thread refresh; "Report" on every agent turn; product detail with
> forecast chart and lots; reports (diversion, destinations, impact, at-risk
> lots); AI settings that persist; tag-based stock filters that match the
> tiles; styled error pages. CSRF is enforced in `hooks.server.ts` (Origin or
> Fetch Metadata) because Chrome omits Origin on same-origin `fetch`.
>
> Not built: PWA (manifest, service worker, push), sign-in/onboarding
> (Phase 1), orders (Phase 3), CSV import, stock opname, supplier/PO screens,
> photo-to-listing, i18n. Boxes below are ticked only where done end to end.

---

## Phase 0 — Foundation (M)

**Exit:** an installable PWA deployed on Cloud Run, logging in against worksh.io
staging through `seller-svc`, CI green.

- [x] App shell: `AppShell` (430px, centred) + `BottomNav` with the canvas's
      five destinations; `nav.ts` rewritten
- [x] Design tokens from the canvas in `layout.css`; Young Serif in `app.html`
- [x] `Icon` set (canvas stroke paths), `Chip`, `AiLabel`, `QtyStepper`,
      `Composer`, `ChatHeader`
- [x] `src/lib/server/api/` — typed client per endpoint group with the
      `SELLER_SVC_MOCK` switch; `src/lib/types/api.ts`; fixture contract test
- [ ] PWA: `manifest.webmanifest`, maskable icons, manifest shortcuts (Foto
      Waste photo, Assistant), `src/service-worker.ts` precaching the shell, offline
      fallback page. **Note:** SvelteKit 3 uses `$app/service-worker` (`self`)
      and `$app/manifest` (`immutable`, `assets`, `prerendered`) — not the
      `$service-worker` module older docs describe
- [ ] `EmptyState`, `ErrorRetry`, `Skeleton`, `Toast` as shared components
      (currently inlined per screen)
- [ ] i18n: `src/lib/i18n/{en,id}.ts` + `t()`, **English default**. Note the
      backend serves most user-facing copy (`seed.rs`), so a real second
      language needs a locale on the request, not just a frontend table
- [ ] `(app)/+layout.server.ts` session guard; `(auth)` and `(public)` groups
- [ ] CI: `npm run check`, `npm run lint`, `npm test`, build; deploy to staging
      on main, preview per PR
- [ ] Lighthouse PWA + performance baseline recorded, so later phases have a
      number to regress against

## Phase 1 — Daftar & onboarding (M)

**Exit:** a new seller registers, finishes the wizard, and sees their live lapak.

Canvas row A (A1–A5) is the reference: Selamat datang, Masuk, Daftar,
OTP verification, Create shop. A1 is the only full-pine screen in the app.

- [ ] A1 `/` — chat-preview hero, "Your shop, run through chat.", two CTAs
- [ ] `/sign-in` — WhatsApp OTP (6-digit input, resend with visible backoff) and
      Google; terms acceptance
- [ ] Wizard `(auth)/sign-up/*`, steps 1–6, with step dots, back, and resume at
      the first unfinished step after a drop-off
- [ ] Slug availability check, debounced, with a clear taken/available state
- [ ] `/terbit` — pre-flight results, then URL, QR and share buttons
- [ ] Onboarding checklist on the assistant home ("Your shop is 4/6 ready")
- [ ] Funnel events fired from the server actions

## Phase 2 — Products and stock (L)

**Exit:** a merchant manages catalog, stock, lots, suppliers and POs from the app.

- [x] C2 product list: search, category pills, stock chip, status; `ProductRow`
      (fixtures; filtering is client-side until the backend paginates)
- [x] C4 stock list: summary tiles, filter pills, cover bar; `StockRow`
- [x] C6 AI settings: mode, model per task, autonomy, cost cap, privacy
      (renders; none of the controls persist yet)
- [ ] Cursor pagination on the product list once `/v1/products` is real
- [ ] C3 product detail + create/edit with multi-image upload and reorder
- [ ] C5 stock detail: lots, history, orders
- [ ] Product extras in the form: perishable, shelf life, track lots
- [ ] **Photo-to-listing**: take a photo → suggested title, category,
      attributes, description, each field editable and labelled `Generated by AI`;
      nothing is saved until the merchant approves
- [ ] CSV import: file pick → preview table with per-row errors → commit
- [ ] Stock by location; lot list with expiry and days left (`ExpiryBadge`)
- [ ] Stock adjust with `ReasonChips`
- [ ] Stock opname: count by aisle, running progress, submit
- [ ] Suppliers list/edit with lead time, pack size, MOQ
- [ ] Purchase orders: list, detail, create, submit; **terima barang** with lot + expiry entry per line
- [ ] Role-aware UI: staff sees no supplier prices or margin figures

## Phase 3 — Orders and basic reports (M)

**Exit:** orders are fulfilled in-app; the assistant home and reports show real numbers.

- [ ] Orders list across channels with a channel chip; detail; process, ship,
      tracking number
- [ ] Assistant home: all five sections from [01-app-map.md](01-app-map.md), each
      degrading independently, slow sections streamed with `{#await}`
- [ ] Reports: revenue and profit, cash in vs profit, best sellers, stock
      value; `StatTile`, `Sparkline`
- [ ] `/more` menu for the phone layout

## Phase 4 — Data pipeline & forecast (L) — backend-only

No frontend work. Use the time for the Playwright harness and the component
tests that Phase 6 will lean on.

- [ ] Playwright set up against staging with the seed tenant
- [ ] Vitest component tests for the Phase 2–3 forms

## Phase 5 — Risk engine & events (M) — backend-only

No frontend work. Build the card components against recorded fixtures so Phase 6
is wiring rather than design.

- [ ] `ReorderCard`, `ExpiryCard` built and unit-tested against fixture payloads
      from the backend's golden files

## Phase 6 — Shop Assistant chat (L)

**Exit:** the demo's reorder story works end to end — card → question → edit →
approve → PO, on a phone.

- [ ] `/assistant/activate` — what the assistant does, and the "no writes without
      your tap" promise
- [ ] `/assistant/readiness` — data-readiness questions as a short chat
- [x] B0 assistant home: greeting, _Needs attention today_, _Try asking_
- [x] `Thread` switching over every card type, unknown type → plain text
- [ ] Virtualise the message list once a thread can exceed a screenful
- [ ] SSE store (`src/lib/stores/assistant.ts`): one shared `EventSource`,
      `Last-Event-ID` resume, `resync` → `invalidate('app:thread')`,
      visibility-based disconnect, badge count
- [x] B3 reorder card: the _why_, `QtyStepper` capped at the proposed quantity,
      _Approve_ / _Change quantity_ / _Reject_ as form actions with an
      `Idempotency-Key`; inline grounded answer with two actions
- [ ] `QuickReplies` + free-text send with optimistic echo
- [x] System pill + result card with _Send via WhatsApp_ (`wa.me` prefill)
- [x] `AiLabel` on every agent turn
- [ ] `ReportAnswer` → moderation queue
- [ ] `/assistant/settings` — watched SKUs, channels
- [ ] `/assistant/autonomy` — auto-approve rules with a visible cancel window — **P1**

## Phase 7 — Waste photo & AI vision (M)

**Exit:** photo → outlined items → confirmed write-off, on the demo phone.

- [ ] `/waste/photo`: `getUserMedia` with `facingMode: environment`, file-input
      fallback, shutter, retake, torch toggle where supported
- [ ] Client-side EXIF/GPS strip (canvas re-encode) + resize to 1600 px WebP
- [ ] Signed-URL `PUT` to GCS with upload progress via `XMLHttpRequest`
- [ ] Analyze with a real progress state (scanning shimmer on the photo, static
      bar under `prefers-reduced-motion`)
- [x] B5 card: detection boxes over the photo, per-item condition and
      confidence, condition-filtered destination chips, low-confidence block
      with candidates + _Not one of our products_, value at cost in the header
- [ ] Make the destination chips and candidates submit (selectable, not saved)
- [ ] Confirm → write-off through the executor
- [ ] IndexedDB queue for photos captured offline, retried on `online`

## Phase 8 — Waste destinations (L)

**Exit:** every waste item gets a destination; donation with receipt and the
daily special work; the diversion score shows in Reports.

- [ ] `/waste/destination`: `DestinationOption` list filtered by expiry state,
      highest recovery preselected, Rp recovered on each, **landfill explicit
      and never default**
- [ ] `/waste/markdown` — markdown ladder preview (steps, channels, then-what)
- [ ] `/waste/special` — the Gemini idea with yield, price, recovery; approve →
      recipe + work order + listed for the day
- [ ] `/waste/donation` — recipient pick, `SafetyChecklist` as a hard gate, pickup
      window; `/waste/donation/[id]` tanda terima with the receipt PDF
- [ ] `/waste/recycle` — oil, organic, packaging logs
- [ ] `/waste/recipients` — recipients CRUD
- [ ] `/reports/waste` — by destination + diversion score
- [ ] `/reports/impact` — weekly digest, "dari N foto", diversion %

## Phase 9 — Notifications, hardening & demo (M)

**Exit:** the 7-minute demo runs three times in a row on staging without
intervention, on the demo phone.

- [ ] Push: opt-in screen that explains what is sent, subscribe, service-worker
      `push` + `notificationclick` deep links; iOS install note
- [ ] Quiet-hours and channel settings surfaced read-only from the backend
- [ ] Accessibility pass: 44 px targets, labels, contrast, focus order,
      `aria-live` on the thread, TalkBack run on the demo phone
- [ ] Performance: Lighthouse on a throttled mid-range profile against the
      Phase 0 baseline; bundle budget enforced in CI
- [ ] Playwright E2E of the full demo path, run three times in CI
- [ ] Empty, loading, error and offline states reviewed on **every** demo screen
      — the states that get skipped and then show up on stage
- [ ] Phone testing on a real mid-range Android: camera, install, push, SSE
      through a venue network

## Phase 10 — Sell-side waste features (post-hackathon, M)

- [ ] Markdown ladder UI live on lapak + POS (needs the worksh.io price override)
- [ ] Bundling suggestions and bundle creation
- [ ] Surplus hand-off deep link
- [ ] Staff-meal destination

## Phase 11 — Recycle & reporting (post-hackathon, M)

- [ ] Oil, organic and packaging logs as first-class screens
- [ ] Damaged-on-arrival → supplier return flow
- [ ] `/reports/monthly` with the PDF, CO₂e and the "Low Waste Shop" badge

## Phase 12 — Scale & platform (post-hackathon, L)

- [ ] Multi-location switcher and transfer as an expiry action
- [ ] Pricing tiers and paywall states
- [ ] Shared component extraction with `../comingsoon` if the overlap justifies
      a package
