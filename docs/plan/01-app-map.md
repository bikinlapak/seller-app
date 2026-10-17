# 01 — App map

> **Revised 2026-10-15** against the design canvas _bikinlapak Seller App Funnel_
> (21 artboards, 390×844). The canvas supersedes the module map first written
> from the Notion page; what changed and why is in
> [00-overview.md](00-overview.md#the-design-canvas-changed-this-plan).

## The shape of the app

The canvas groups its artboards in three rows, and the row titles are the
architecture:

- **A · Sign in and sign up** — 5 screens, pine ground, the only dark surface.
- **B · Asisten Lapak — chat sebagai inti: semua fitur lewat percakapan**
  — 10 screens. _Chat is the core: every feature through conversation._
- **C · Shop, products, stock and AI settings** — 6 screens, the direct
  manipulation surfaces you reach when you'd rather tap than type.

Row B is the product. Rows A and C exist to get you into it and to give you a
place to look when a list is faster than a sentence.

## Navigation

Five destinations, bottom bar, from the canvas:

```plain text
Assistant  /assistant    ← home. There is no separate home screen.
Products   /products
Stock      /stock
Shop       /shop
Me         /me        → AI settings
```

The composer (attach · camera · text · send) sits above the bar on the assistant
home **and** on every thread. Threads hide the bar and let the composer close
the page, exactly as artboards B1–B9 do.

Two consequences worth stating, because they are easy to undo by accident:

- **Orders and Reports are not screens.** They are threads — `ChatPesan`,
  `ChatLaporan`. A purchase order is something you discuss and approve, not a
  list you administer.
- **The camera is one tap from everywhere.** It is in the composer, which is on
  every chat screen, and photographing waste is the action the product is built
  around.

## A · Sign in and sign up

| Artboard | Screen                                                             | Route          |
| -------- | ------------------------------------------------------------------ | -------------- |
| A1       | Welcome — chat preview as the hero, "Your shop, run through chat." | `/` (public)   |
| A2       | Sign in                                                            | `/sign-in`     |
| A3       | Sign up                                                            | `/sign-up`     |
| A4       | OTP verification                                                   | `/verify`      |
| A5       | Create shop                                                        | `/create-shop` |

A1 is the one place the pine ground (`#1F5A50`) fills the screen and the
merchant bubble is kunyit. Inside the app the ground is cream and the merchant
bubble is pine — don't carry the hero's palette inward.

## B · Shop Assistant

| Artboard | Thread                                | Route                 | What it has to do                                         |
| -------- | ------------------------------------- | --------------------- | --------------------------------------------------------- |
| B0       | Assistant home                        | `/assistant`          | Greeting, _Needs attention today_, _Try asking_, composer |
| B1       | Add a product from a photo            | `/assistant/product`  | Photo → suggested listing, merchant approves              |
| B2       | Check and adjust stock                | `/assistant/stock`    | Answer from stored numbers; offer an adjustment           |
| B3       | Reorder suggestion → PO               | `/assistant/reorder`  | **Demo path.** Card → question → edit → approve → PO      |
| B4       | Expiring soon → discount              | `/assistant/expiry`   | Expiry risk, markdown ladder                              |
| B5       | Waste photo → AI vision → destination | `/assistant/waste`    | **Demo path.** Photo → items → destinations               |
| B6       | Donation + receipt                    | `/assistant/donation` | Recipient, safety checklist gate, receipt                 |
| B7       | Today's special from stock            | `/assistant/special`  | Idea constrained to in-stock items                        |
| B8       | Reports and impact                    | `/assistant/report`   | Revenue, profit, diversion %                              |
| B9       | Shop settings                         | `/assistant/shop`     | Opening hours and shop settings by conversation           |

### B0 · Assistant home

Three sections, in this order:

1. **Greeting** — `Morning, Rima.` Young Serif, 24px, pine. The time of day comes
   from the backend; the frontend does not decide when morning ends.
2. **Needs attention today** — a white card, AI chip top-right, one row per
   urgent item: a 36px tinted icon tile, a consequence as the title
   (_"Arabica beans run out Thursday"_), the suggestion beneath (_"Suggested: order
   12 kg"_), chevron. Each row links straight into the thread that handles it.
   **If nothing is urgent the section is absent** — not filled with reassurance.
3. **Try asking** — a 2-column grid of example commands. Its job is to teach
   that the app is driven in plain Bahasa.

### B3 · Reorder suggestion (the demo path)

The card is an `<article>` in the agent-bubble shape:

- `REORDER SUGGESTION` label (12px/700/pine, uppercased in CSS so screen readers
  still read normal case) and `Keyakinan tinggi` on the right.
- Title with the proposed quantity; then the _why_, in one sentence that names
  the numbers: stock, daily rate, run-out day, supplier lead time.
- `Approve` · `Change quantity` · `Reject`. **`Change quantity` opens a stepper capped at
  the proposed quantity** — the merchant may go down, never up, because the
  action token carries that cap and the backend enforces it. The UI must not
  offer what the backend will reject.
- The merchant's question gets a grounded answer with two inline actions
  (_Pesan 9 kg_ / _Tetap 12 kg_).
- Approval leaves a centred system pill (_"You approved 9 kg · 07.05"_) and a
  **result card** — pine-300 border, pine-100 header strip, check in a pine
  circle — carrying _Send via WhatsApp_ and _Lihat PO_.

### B5 · Waste photo (the demo path)

- The photo is a merchant-side bubble, 220×150, with detection boxes over it:
  solid `#8FD3B6` where the model is confident, dashed kunyit where it is not.
  Box positions are percentages, so they survive any screen width.
- The card lists each item with condition and confidence
  (_"still good · 96%"_, _"past date · 92%"_) and a row of destination
  chips. **Destinations are filtered by condition**: an expired item offers
  compost or disposal and says why — _"Past its date: it cannot be sold or
  donated."_
- **`Discard` is never preselected.** Landfill is always a deliberate choice.
- Below the threshold: a `#FFF8F0` block, _"Not sure (58%): what is
  this?"_, the top candidates, and _Not one of our products_.
- The footer states the privacy behaviour outright: _"Photo kept as evidence ·
  location data removed."_

## C · Shop, products, stock and AI settings

| Artboard | Screen                              | Route                             |
| -------- | ----------------------------------- | --------------------------------- |
| C1       | Shop settings                       | `/shop`                           |
| C2       | Product list                        | `/products`                       |
| C3       | Add / edit product                  | `/products/new`, `/products/[id]` |
| C4       | Stock and inventory                 | `/stock`                          |
| C5       | Stock detail: lots, history, orders | `/stock/[id]`                     |
| C6       | AI model settings                   | `/me`                             |

**C2 · Products** — search, category pills, rows of photo + name + price + stock
chip + status. Two floating actions: _From a photo (AI)_ (into B1) and _Add
product_, the only kunyit button in the app's interior.

**C4 · Stock** — three summary tiles (stock value, running low, expiring
soon), filter pills, then rows with a cover bar coloured by condition and
two captions: days left on the left, the PO or lot on the right. Three actions
at the foot: _Receive goods_, _Stocktake_, _Create PO_ (into B3).

**C6 · AI settings** — the screen that makes the assistant feel owned rather
than imposed, and the one with no equivalent in the Notion plan:

- **Assistant mode** — Frugal / Balanced / Thorough, as a radio group.
- **Model per tugas** — chat, vision, ideas, and forecasting. Forecasting is
  labelled `TimesFM` with the note _"computed by the system, not by chat"_. The
  product tells the merchant which numbers a language model did not invent.
- **Seberapa mandiri** — auto-approve small orders (with the earned-trust rule
  spelled out: ≤Rp500 rb, three unedited approvals), auto-markdown, language
  and tone.
- **Batas biaya AI** — a cap with a usage bar and the fallback stated: _"If it runs out,
  the assistant drops to Frugal."_
- **Privacy** — training stance, photo retention, delete history, export.

## Not in this app

**Today's discounts** for buyers lives in the existing discovery site on
bikinlapak.com, fed by the same markdown events.
