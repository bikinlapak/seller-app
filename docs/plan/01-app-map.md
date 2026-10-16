# 01 — App map

> **Revised 2026-10-15** against the design canvas _bikinlapak Seller App Funnel_
> (21 artboards, 390×844). The canvas supersedes the module map first written
> from the Notion page; what changed and why is in
> [00-overview.md](00-overview.md#the-design-canvas-changed-this-plan).

## The shape of the app

The canvas groups its artboards in three rows, and the row titles are the
architecture:

- **A · Masuk & daftar** — 5 screens, pine ground, the only dark surface.
- **B · Asisten Lapak — chat sebagai inti: semua fitur lewat percakapan**
  — 10 screens. _Chat is the core: every feature through conversation._
- **C · Kelola toko, produk, stok & pengaturan AI** — 6 screens, the direct
  manipulation surfaces you reach when you'd rather tap than type.

Row B is the product. Rows A and C exist to get you into it and to give you a
place to look when a list is faster than a sentence.

## Navigation

Five destinations, bottom bar, from the canvas:

```plain text
Asisten   /asisten     ← home. There is no separate Beranda.
Produk    /produk
Stok      /stok
Toko      /toko
Saya      /saya        → Pengaturan AI
```

The composer (attach · camera · text · send) sits above the bar on the Asisten
home **and** on every thread. Threads hide the bar and let the composer close
the page, exactly as artboards B1–B9 do.

Two consequences worth stating, because they are easy to undo by accident:

- **Pesanan and Laporan are not screens.** They are threads — `ChatPesan`,
  `ChatLaporan`. A purchase order is something you discuss and approve, not a
  list you administer.
- **The camera is one tap from everywhere.** It is in the composer, which is on
  every chat screen, and photographing waste is the action the product is built
  around.

## A · Masuk & daftar

| Artboard | Screen                                                                     | Route         |
| -------- | -------------------------------------------------------------------------- | ------------- |
| A1       | Selamat datang — chat preview as the hero, "Lapakmu, dikelola lewat chat." | `/` (public)  |
| A2       | Masuk (login)                                                              | `/masuk`      |
| A3       | Daftar (register)                                                          | `/daftar`     |
| A4       | Verifikasi OTP                                                             | `/verifikasi` |
| A5       | Buat toko                                                                  | `/buat-toko`  |

A1 is the one place the pine ground (`#1F5A50`) fills the screen and the
merchant bubble is kunyit. Inside the app the ground is cream and the merchant
bubble is pine — don't carry the hero's palette inward.

## B · Asisten Lapak

| Artboard | Thread                         | Route                  | What it has to do                                          |
| -------- | ------------------------------ | ---------------------- | ---------------------------------------------------------- |
| B0       | Beranda chat                   | `/asisten`             | Sapaan, _Perlu perhatian hari ini_, _Coba minta_, composer |
| B1       | Tambah produk dari foto        | `/asisten/produk`      | Photo → suggested listing, merchant approves               |
| B2       | Cek & ubah stok                | `/asisten/stok`        | Answer from stored numbers; offer an adjustment            |
| B3       | Saran pesanan → PO             | `/asisten/pesan`       | **Demo path.** Card → question → edit → approve → PO       |
| B4       | Hampir kedaluwarsa → diskon    | `/asisten/kedaluwarsa` | Expiry risk, markdown ladder                               |
| B5       | Foto sisa → AI vision → tujuan | `/asisten/sisa`        | **Demo path.** Photo → items → destinations                |
| B6       | Donasi + tanda terima          | `/asisten/donasi`      | Recipient, safety checklist gate, receipt                  |
| B7       | Menu spesial dari stok         | `/asisten/spesial`     | Idea constrained to in-stock items                         |
| B8       | Laporan & dampak               | `/asisten/laporan`     | Omzet, untung, diversion %                                 |
| B9       | Atur toko                      | `/asisten/toko`        | Opening hours and shop settings by conversation            |

### B0 · Beranda chat

Three sections, in this order:

1. **Sapaan** — `Pagi, Rima.` Young Serif, 24px, pine. The time of day comes
   from the backend; the frontend does not decide what "pagi" means.
2. **Perlu perhatian hari ini** — a white card, AI chip top-right, one row per
   urgent item: a 36px tinted icon tile, a consequence as the title
   (_"Kopi Arabika habis Kamis"_), the suggestion beneath (_"Saran: pesan
   12 kg"_), chevron. Each row links straight into the thread that handles it.
   **If nothing is urgent the section is absent** — not filled with reassurance.
3. **Coba minta** — a 2-column grid of example commands. Its job is to teach
   that the app is driven in plain Bahasa.

### B3 · Saran pesanan (the demo path)

The card is an `<article>` in the agent-bubble shape:

- `SARAN PESANAN` label (12px/700/pine, uppercased in CSS so screen readers
  still read normal case) and `Keyakinan tinggi` on the right.
- Title with the proposed quantity; then the _why_, in one sentence that names
  the numbers: stock, daily rate, run-out day, supplier lead time.
- `Setujui` · `Ubah jumlah` · `Tolak`. **`Ubah jumlah` opens a stepper capped at
  the proposed quantity** — the merchant may go down, never up, because the
  action token carries that cap and the backend enforces it. The UI must not
  offer what the backend will reject.
- The merchant's question gets a grounded answer with two inline actions
  (_Pesan 9 kg_ / _Tetap 12 kg_).
- Approval leaves a centred system pill (_"Kamu menyetujui 9 kg · 07.05"_) and a
  **result card** — pine-300 border, pine-100 header strip, check in a pine
  circle — carrying _Kirim via WhatsApp_ and _Lihat PO_.

### B5 · Foto sisa (the demo path)

- The photo is a merchant-side bubble, 220×150, with detection boxes over it:
  solid `#8FD3B6` where the model is confident, dashed kunyit where it is not.
  Box positions are percentages, so they survive any screen width.
- The card lists each item with condition and confidence
  (_"masih aman · 96%"_, _"lewat tanggal · 92%"_) and a row of destination
  chips. **Destinations are filtered by condition**: an expired item offers
  compost or disposal and says why — _"Lewat tanggal: tidak boleh dijual atau
  didonasikan."_
- **`Buang` is never preselected.** Landfill is always a deliberate choice.
- Below the threshold: a `#FFF8F0` block, _"Belum yakin (58%): ini produk
  apa?"_, the top candidates, and _Bukan produk toko_.
- The footer states the privacy behaviour outright: _"Foto disimpan sebagai
  bukti · lokasi foto dihapus."_

## C · Kelola toko, produk, stok & pengaturan AI

| Artboard | Screen                             | Route                          |
| -------- | ---------------------------------- | ------------------------------ |
| C1       | Kelola toko                        | `/toko`                        |
| C2       | Daftar produk                      | `/produk`                      |
| C3       | Tambah / ubah produk               | `/produk/baru`, `/produk/[id]` |
| C4       | Stok & inventori                   | `/stok`                        |
| C5       | Detail stok: lot, riwayat, pesanan | `/stok/[id]`                   |
| C6       | Pengaturan model AI                | `/saya`                        |

**C2 · Produk** — search, category pills, rows of photo + name + price + stock
chip + status. Two floating actions: _Dari foto (AI)_ (into B1) and _Tambah
produk_, the only kunyit button in the app's interior.

**C4 · Stok** — three summary tiles (nilai stok, hampir habis, hampir
kedaluwarsa), filter pills, then rows with a cover bar coloured by condition and
two captions: days left on the left, the PO or lot on the right. Three actions
at the foot: _Terima barang_, _Stock opname_, _Buat PO_ (into B3).

**C6 · Pengaturan AI** — the screen that makes the assistant feel owned rather
than imposed, and the one with no equivalent in the Notion plan:

- **Mode asisten** — Hemat / Seimbang / Teliti, as a radio group.
- **Model per tugas** — chat, vision, ideas, and forecasting. Forecasting is
  labelled `TimesFM` with the note _"angka dihitung sistem, bukan chat"_. The
  product tells the merchant which numbers a language model did not invent.
- **Seberapa mandiri** — auto-approve small orders (with the earned-trust rule
  spelled out: ≤Rp500 rb, three unedited approvals), auto-markdown, language
  and tone.
- **Batas biaya AI** — a cap with a usage bar and the fallback stated: _"Jika
  habis, asisten pakai mode Hemat."_
- **Privacy** — training stance, photo retention, delete history, export.

## Not in this app

**Diskon hari ini** for buyers lives in the existing discovery site on
bikinlapak.com, fed by the same markdown events.
