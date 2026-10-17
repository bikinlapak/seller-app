# 04 — Design system, copy, accessibility

> **Revised 2026-10-15.** The tokens below are read off the design canvas
> _bikinlapak Seller App Funnel_ and are in `src/routes/layout.css`. Where the
> canvas and the `../comingsoon` palette disagree, the canvas wins for this app
> and the shared token keeps its old value.

## Typeface

| Role    | Face            | Weights               | Where                                                                                                    |
| ------- | --------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| Display | **Young Serif** | 400 only              | Screen titles (`Products`, `Stock`), the greeting (`Morning, Rima.`), the `bl` monogram, the A1 headline |
| Body    | **Figtree**     | 400 · 500 · 600 · 700 | Everything else                                                                                          |

Young Serif replaces Plus Jakarta Sans for display in this app. It has one
weight — don't ask for 600, you'll get a synthesised face.

## Palette

Hexes are the canvas's own. Token names follow the existing repo convention.

**Pine** — the primary. `pine-600 #1F5A50` is the app's voice: the send button,
the merchant's own chat bubble, primary buttons, active nav, screen titles.

| Token      | Hex       | Use                                           |
| ---------- | --------- | --------------------------------------------- |
| `pine-100` | `#E3EEEA` | Icon tiles, result-card header, selected chip |
| `pine-200` | `#D9E6E2` | Body text on a pine ground (A1 only)          |
| `pine-300` | `#A9CBBF` | Result-card border                            |
| `pine-400` | `#7FA79E` | Outlined button border on pine                |
| `pine-600` | `#1F5A50` | Primary                                       |
| `pine-800` | `#163F39` | Text on `pine-100`; the A1 chat panel         |

**Kunyit** — the accent, used sparingly. In the interior it is exactly one
thing: the _Tambah produk_ button.

| Token        | Hex       | Use                                         |
| ------------ | --------- | ------------------------------------------- |
| `kunyit-100` | `#FBEFD6` | Near-expiry tint                            |
| `kunyit-400` | `#E8A63A` | Accent fill, cost bar, unsure detection box |
| `kunyit-700` | `#8A5A10` | Near-expiry text, "Not sure" heading        |
| `kunyit-800` | `#5C3D0A` | Text on `kunyit-100`                        |
| `kunyit-900` | `#3D2805` | Text on `kunyit-400`                        |

**Ground, surface, line** — the app is cream with white cards.

| Token          | Hex       | Use                                        |
| -------------- | --------- | ------------------------------------------ |
| `cream`        | `#FAF6EF` | App ground, input fills                    |
| `surface`      | `#FFFFFF` | Cards, header, composer, nav               |
| `surface-warn` | `#FFF8F0` | The "not sure" block                       |
| `line`         | `#E6DDCF` | Card and header borders                    |
| `line-soft`    | `#F2EADD` | Dividers inside a card; empty bar track    |
| `line-strong`  | `#D6CCBC` | Secondary button borders, unselected chips |
| `chip`         | `#EAE2D6` | Neutral chip (the AI label, `TimesFM`)     |

**Text** — `ink #2A2521`, `ink-label #4F4740` (section labels),
`ink-muted #685E55` (secondary), `ink-faint #8A7F73` (chevrons).

**Status** — note the danger family is _warm brown-red_, not the
`comingsoon` `error` red. Both exist; use the warm one in this app.

| Meaning       | Text                                       | Fill                |
| ------------- | ------------------------------------------ | ------------------- |
| Aman          | `sukses #22663F`                           | `sukses-bg #E2F1E7` |
| Hampir        | `kunyit-700`                               | `kunyit-100`        |
| Lewat tanggal | `bahaya #8E2F1C` / `danger-strong #7A2818` | `danger-bg #F3DCCB` |

**Vision** — `foto-dasar #3A3128` (photo ground),
`kotak-yakin #8FD3B6` (confident box); unsure boxes are dashed `kunyit-400`.

## Shape and scale

| Token           | Value | Use                                        |
| --------------- | ----- | ------------------------------------------ |
| `radius-action` | 10px  | Buttons inside a card                      |
| `radius-tile`   | 10px  | 36px icon tiles                            |
| `radius-field`  | 12px  | Inputs, icon buttons, summary tiles        |
| `radius-row`    | 14px  | List rows, section cards, primary buttons  |
| `radius-card`   | 16px  | Panels, sections                           |
| —               | 999px | Chips, composer controls, floating actions |

Chat bubbles carry a 4px corner toward their sender —
`.bubble-agent` is `4px 16px 16px 16px`, `.bubble-staff` is
`16px 4px 16px 16px`. Assistant **cards are the agent bubble shape**: a card is
something the assistant said.

**Touch targets:** 34px destination chips, 36px filter pills, 42px card
buttons, 44px composer and icon buttons, 46px card CTA, 48px nav items, 52px
primary buttons, 56px quick commands. Nothing interactive below 34px, and
nothing you tap often below 44px.

## Components built

`src/lib/components/`

**Shell** — `AppShell` (430px max, centred; desktop is the same app, not a
second layout), `BottomNav`, `Composer`, `ChatHeader`, `Icon`.

**Chat** (`chat/`) — `Thread`, `Bubble`, `AgentMeta`, `SystemNote`,
`PhotoMessage`, `SuggestionCard`, `ResultCard`, `WasteCard`.

**Data** — `ProductRow`, `StockRow`, `Chip`, `AiLabel`, `QtyStepper`,
`AttentionList`, `QuickCommands`.

`Thread` is the one that pays for itself: a single switch over message type,
with an unknown type falling back to plain text rather than throwing. The
backend can add a card type without a change here.

`QtyStepper` carries the rule that matters: `max` comes from the action token's
cap, so the merchant can only revise _downward_. The backend rejects an
over-cap approval; the UI must never offer one.

## Icons

Inline stroke SVG, 24 viewBox, `stroke-width: 2`, round caps — the canvas's own
paths, collected in `Icon.svelte`. **No emoji as iconography.** Icon-only
buttons carry `aria-label`; decorative icons are `aria-hidden`.

## Copy

- **English** throughout: user-facing copy, code comments, identifiers and the
  API contract. This diverges from `../comingsoon`, which is Indonesian, by
  decision on 2026-10-16 — the product ships in English. Indonesian remains a
  choice in AI settings, and the backend serves the copy, so translating it
  later means translating `seed.rs`, not the components.
- **Tone:** second person, direct, no jargon. _"Arabica beans run out
  Thursday"_, not _"Stock cover: 2.1 days"_. Urgency is phrased as a
  consequence.
- **Numbers come from the backend, already formatted.** The frontend computes no
  Rupiah and no day counts. If a figure is on screen, a response contained it —
  which is also what makes the assistant's claims auditable.
- **Placeholders are bracketed and loud**: `[PHOTO OF LEFTOVER TRAY]`,
  `[PARTNER FOOD BANK]`. Never invented stand-in data.
- **`AiLabel` on everything generated** — the chip beside the agent's name, and
  on the attention card. Non-negotiable.
- Money `Rp35,000`; abbreviated `Rp6.8M`, `~Rp167k`. Times `21.30` with a
  period (the shop's own convention). Dates relative inside a week
  (_"out Thursday"_, _"exp. tomorrow"_). The currency stays rupiah — the
  merchants are Indonesian even though the interface is English.

## Accessibility

- 44px targets for anything tapped often; 34px floor for chips.
- Every input has a real `<label>`; destination chips are a labelled
  `fieldset`/`radiogroup`, not styled divs.
- The thread is `aria-live="polite"` so an arriving card is announced once.
- **Status is never colour alone** — stock bars carry a figure and a text
  caption, condition chips carry words (_"past date · 92%"_).
- Section labels are uppercased in CSS, so assistive tech reads normal case.
- `env(safe-area-inset-bottom)` respected by the nav and the composer.
- Dark mode is **out of scope for v1**: this is used in daylight behind a
  counter, and a half-done dark theme costs more than it returns.
- TalkBack on the demo phone in Phase 9 — assumed working is not working.
