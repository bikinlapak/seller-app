# 03 — PWA, realtime, camera

The four capabilities that make this a usable app behind a counter rather than a
website: install, offline, push, camera. Plus SSE, which is what makes Asisten
Stok feel like a conversation.

## Install (PWA)

- `static/manifest.webmanifest` — `name: "bikinlapak Seller"`,
  `short_name: "Seller"`, `display: standalone`, `theme_color` from
  `--color-pine-600`, `background_color` from `--color-cream`, maskable icons at
  192/512, `start_url: /beranda`, `lang: id`, `orientation: portrait`.
- Shortcuts in the manifest for **Foto Sisa** and **Asisten Stok** — long-press
  the home-screen icon and photograph waste in one tap. The cheapest feature in
  this document, relative to how much it is used.
- An install prompt on Beranda after the third session, dismissible for good.
  Not on first load, where it reads as a popup.

`adapter-node` stays: there is server-side load and there are sessions, so a
static adapter is not an option.

## Offline

A hand-written service worker in `src/service-worker.ts` (SvelteKit builds it
and gives it `$service-worker`'s `build`, `files`, `version`), with three
behaviours:

| Resource                     | Strategy                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| App shell (`build`, `files`) | Precache on install, cache-first, purged on version change                                                                   |
| `GET` page data              | Network-first with a short timeout, falling back to the last good response and a visible "data mungkin tidak terbaru" banner |
| Photos pending upload        | IndexedDB queue, retried on `online`                                                                                         |

**Writes are not replayed automatically.** A queued approval becomes a visible
_"Belum terkirim — coba lagi"_ item the merchant taps, never a background
retry. A purchase order that fires twice, or fires an hour late at a price that
has changed, is worse than one that failed loudly. The exception is a waste
_photo upload_, which is idempotent (content-addressed) and safe to retry.

Offline fallback page: `src/routes/+error.svelte` plus a precached
`static/offline.html` for a cold start with no network.

## Push notifications

- Web Push with VAPID. Subscribe from `/pengaturan` **after** the merchant opts
  in on a screen that explains what will be sent — never a cold
  `Notification.requestPermission()` on load, which gets denied permanently and
  cannot be re-asked.
- `POST /v1/push/subscribe` with the endpoint, keys and platform.
- The service worker's `push` handler renders the notification and
  `notificationclick` deep-links into the thread or the suggestion.
- Quiet hours and the escalation ladder are the backend's decision
  (`passtok-notifier`); the client shows the current setting and nothing more.
- iOS Safari only allows push for an **installed** PWA. The settings screen says
  so, in Bahasa, with install instructions, rather than silently failing.

## Camera

```plain text
Primary:   getUserMedia({ video: { facingMode: 'environment' } }) → <video>
           → capture to <canvas> → toBlob('image/webp', 0.8)
Fallback:  <input type="file" accept="image/*" capture="environment">
```

The fallback is not a formality — it is the path on any browser that denies
camera access, on an older Android WebView, and in a desktop demo. Both paths
converge on the same `Blob`, so only the capture step branches.

Before upload, in the browser:

1. **Strip EXIF**, GPS above all — re-encoding through a canvas drops metadata
   as a side effect, which is the simplest correct implementation. The backend
   strips again as a second line of defence.
2. **Resize** the long edge to 1600 px and encode WebP at ~0.8. A 4 MB phone
   photo becomes ~250 KB: the difference between a 2-second and a 20-second
   upload on a warung connection, and a direct saving on Gemini cost.
3. **Upload** with `PUT` to the V4 signed URL from `POST /v1/waste/photos`,
   straight to GCS, with progress from `XMLHttpRequest`'s `upload.onprogress`
   (`fetch` still gives no upload progress).

Then `POST /v1/waste/analyze`. It takes up to six seconds, so the confirm screen
shows a real progress state — the photo with a scanning shimmer, not a spinner
over a blank page.

## SSE (Asisten Stok)

```plain text
GET /v1/assistant/stream
  events: message | suggestion | result | resync | ping
```

- Connect in `onMount` of `asisten/+page.svelte` and on Beranda (for the badge),
  one connection shared through a store in `src/lib/stores/assistant.ts` so two
  mounted components do not open two streams.
- `EventSource` reconnects on its own and replays `Last-Event-ID`; the server
  honours it. On `resync`, call `invalidate('app:thread')` and let the server
  reload rather than patching state from a guess.
- Close on `visibilitychange` → hidden for more than 60 seconds, reopen on
  visible. A phone in a pocket should not hold a connection open.
- `ping` every 25 seconds from the server keeps proxies from closing the stream;
  the client treats 60 seconds of silence as dead and reconnects.
- Optimistic send: the merchant's own message appears immediately with a pending
  mark, and is reconciled when it arrives back over the stream.
- The badge count lives in the same store, so a card arriving while the merchant
  is on Produk lights the Asisten tab.

## What is deliberately not used

- **WebSockets** — SSE is enough for a one-way stream and survives proxies.
- **Background Sync / Periodic Sync** — not on iOS, and a background-replayed
  purchase order is exactly the behaviour ruled out above.
- **Client-side AI** — every model call goes through the backend, which holds
  the keys, the cost cap and the audit trail.
