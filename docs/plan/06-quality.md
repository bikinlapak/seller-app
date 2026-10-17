# 06 — Quality bar

## Definition of done (every screen)

- [ ] **All five states** designed and built: loading, empty, error, offline,
      populated. The ones that get skipped are the ones that appear on stage.
- [ ] **Phone first** — checked at 360 px before any desktop work.
- [ ] **Bahasa copy reviewed**; `AiLabel` present on every generated string.
- [ ] **Keyboard and TalkBack reachable**; 44 px targets; labelled inputs.
- [ ] **Numbers come from the backend**, not computed in the component.
- [ ] `npm run check` (svelte-check), `npm run lint` (prettier), `npm test`
      clean.

## Testing

**Component (Vitest + `@testing-library/svelte`).** The components where a bug
costs money or trust:

- `QtyStepper` — cannot exceed the `max` the reorder card sets from the token
  cap. The backend rejects an over-cap approval, but the UI must never offer
  one.
- `MoneyField` — integer Rupiah only; no float, no decimals, paste sanitised.
- `Thread` — renders every card type, and falls back to plain text on an
  unknown type instead of throwing.
- `SafetyChecklist` — the donation submit stays disabled until every item is
  ticked.
- `SuggestionCard` / `WasteCard` — rendered against fixture payloads taken from
  the backend's golden files, so a contract change shows up here.
- `WasteCard` destination rules — an expired item offers no donation or sale,
  `Discard` is never preselected, exactly one destination preselected per item.
  These are asserted today in `src/lib/mock/fixtures.spec.ts`.
- `nav.ts` `isActive` — already tested (`nav.spec.ts`); extend for the nested
  routes.

**Contract.** `src/lib/types/` asserted against recorded `seller-svc` responses
in a test. The two repos cannot share a schema at compile time, so a renamed
field has to fail _somewhere_ — this is where.

**E2E (Playwright, against staging with the seed tenant).** The demo path is the
primary suite, run three times in CI to catch flake:

1. Login → `/assistant` shows _Needs attention today_.
2. Reorder card arrives over SSE → ask "kenapa 12?" → answer quotes a number
   present in the payload → edit to 9 → _Approve_ → result card with PO-0771.
3. `/assistant/waste` with a fixture image → items outlined → destinations →
   donation with the checklist → tanda terima.
4. `/assistant/report` diversion score has moved.

Plus the paths that are not demoed but are easy to break: the Phase 1 wizard end
to end, the CSV import with a bad row, and _terima barang_ with lot entry.

**Offline, as a test not a hope.** Playwright with `context.setOffline(true)`:
the shell still loads, a queued photo surfaces as "Belum terkirim", and a queued
approval is **not** auto-submitted when the connection returns.

**Device.** On the real demo phone during Phase 9, because these cannot be
emulated honestly: camera permission and capture, install to home screen, push
delivery, and an SSE stream over a venue network.

## Performance budget

Measured on a throttled mid-range Android profile (Lighthouse, 4× CPU, Slow 4G),
baselined in Phase 0 and enforced in CI from Phase 3:

| Metric                             | Budget                       |
| ---------------------------------- | ---------------------------- |
| LCP on `/assistant`                | < 2.5 s                      |
| INP                                | < 200 ms                     |
| CLS                                | < 0.1                        |
| JS transferred, first load         | < 180 KB gzipped             |
| Lighthouse PWA                     | installable, all checks pass |
| Time to first card on `/assistant` | < 1.5 s from navigation      |

Levers, in the order they matter here: the backend returns screen-shaped
aggregates (one request per screen), slow sections stream with `{#await}`, the
thread list is virtualised, images are `loading="lazy"` with explicit dimensions
(so no CLS), and no chart library ships for a 7-point sparkline.

If the budget is missed, the fix is fewer bytes, not a faster spinner.

## Security on the client

- **Nothing sensitive reaches the browser.** The session cookie is `HttpOnly`;
  the worksh.io token lives server-side. `seller-svc`'s address is a private env
  var. Repeating the rule because it is the one a quick fix breaks: no component
  fetches `seller-svc` directly.
- **CSP** set as response headers from the Node adapter: no inline script
  (SvelteKit's hashes handle its own), `img-src` limited to self, data and the
  GCS host, `connect-src` to self only.
- **No `{@html}`** on anything from the backend — agent text included. A product
  name is a vector; the agent is told to ignore instructions in catalog data,
  and the renderer does not execute markup regardless.
- **Idempotency keys** generated per form instance, so a double-tap or a retry
  on a flaky connection cannot create two purchase orders.
- **No client-side authorization.** Role-aware UI (staff sees no margin figures)
  is a courtesy; the backend and works-server enforce it.
