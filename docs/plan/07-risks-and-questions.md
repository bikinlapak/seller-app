# 07 — Risks and open questions

## Risks

| Risk                                         | Mitigation                                                                                                                                                            |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scope is large for a hackathon               | Hard cut line after Phase 9; build the demo path first, breadth second; Phases 4–5 have almost no frontend work, so use them for the test harness                     |
| **PWA camera and push differ across phones** | Test on the demo phone in Phase 7, not Phase 9; `<input capture>` fallback for camera from the start; iOS push needs an installed PWA and the settings screen says so |
| Demo data looks fake                         | The seed tenant (Toko Kopi Jasa) uses realistic patterns and real shop photos; say on stage that it is simulated                                                      |
| Gemini latency showing as a hung UI          | Real progress states on analyze and suggest; card text is pre-generated server-side at event time, so the thread never waits on a model                               |
| Venue network drops mid-demo                 | SSE reconnect with `Last-Event-ID`; offline shell; a backup video                                                                                                     |

### Frontend-specific risks

| Risk                                                                                                 | Mitigation                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SvelteKit 3 / Svelte 5 / Tailwind 4 are all recent majors — few answers online when something breaks | Keep to documented APIs; the repo conventions (`defineEnvVars`, `#lib/*`, `@theme`) are already proven in `../comingsoon`; budget a day in Phase 0 for upgrade friction |
| Two repos, no shared schema → a silent contract drift                                                | Hand-written types in `src/lib/types/` asserted against recorded responses in a test; the test fails on a renamed field                                                 |
| SSE through an unknown proxy                                                                         | Server `ping` every 25 s; 60 s of silence reconnects; `resync` + `invalidate` rather than patching state from a guess                                                   |
| Offline writes replayed into duplicate purchase orders                                               | Writes are **never** auto-replayed — a queued action becomes a visible "Belum terkirim" the merchant taps. Only content-addressed photo uploads retry                   |
| Eight card types to design and build                                                                 | `MessageCard` as a single switch with a plain-text fallback for unknown types; build `ReorderCard` and `ExpiryCard` in Phase 5 against fixtures so Phase 6 is wiring    |
| Bottom nav at five items and growing                                                                 | `/more` absorbs Stock, Shop, Reports and Settings; the camera FAB stays in thumb reach, which is the action the product exists for                                      |

## Open questions

Carried from the Notion plan, with what each one blocks here:

- [ ] **Hackathon deadline and submission format** — sets the dates for every
      phase.
- [ ] **Does onboarding (Phase 1) need to be in the demo**, or can the demo
      start from a seeded shop? If seeded, Phase 1's seven screens drop behind
      Phase 6 and roughly three days come back.
- [ ] **Seller app as a new app, or a "bikinlapak mode" inside works_app
      (Flutter) later?** If works_app is the eventual home, the component work
      here is throwaway and the plan should favour speed over structure.
- [ ] **Gemini model choice per task** — affects the analyze progress state's
      expected duration, which is a copy decision ("sebentar" vs a progress bar).
- [ ] **Partner food bank for the demo pickup** — blocks the donation screens'
      real content; a recipient of type `own` is the fallback.
- [ ] **Who reviews Bahasa copy and food-safety wording** — the safety checklist
      is a gate on a donation, so its wording is a correctness question.

### Added by this plan

- [ ] **Is the install prompt wanted in the demo?** It demonstrates the PWA
      story but costs a tap on stage. Default: suppressed on the demo tenant.
- [ ] **Dark mode** — out of scope for v1 ([04-design-system.md](04-design-system.md)).
      Confirm nobody is expecting it in the submission.
- [x] **Which language ships?** Settled 2026-10-16: English, throughout —
      copy, comments, identifiers and the API contract. Indonesian stays a
      an option in AI settings but is no longer the default.
- [ ] **Does a real Indonesian translation follow?** The merchants are
      Indonesian, so this matters commercially. Most user-facing copy comes
      from the backend (`seed.rs`), so it needs a locale on the request rather
      than a frontend strings table — more work than the Phase 0 item implies.
- [ ] **Which Android device is the demo phone?** Phase 7 and 9 testing need the
      actual device, and the camera path is where models differ most.
- [ ] **Does the merchant ever need two locations in v1?** The multi-location
      switcher is parked in Phase 12; if the seed tenant has two locations, the
      stock screens need it sooner.
