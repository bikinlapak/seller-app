# seller-app

Seller dashboard for bikinlapak: product management and the online-store web builder. SvelteKit 3, Svelte 5 runes, Tailwind CSS 4, `adapter-node`. Backend: [seller-svc](../seller-svc).

```sh
cp .env.example .env
npm install
npm run dev        # http://localhost:5173 — jalan tanpa backend (lihat Mock)
npm run check
npm test
npm run build && node build
```

## Menjalankan dengan seller-svc sungguhan

```sh
# terminal 1
cd ../seller-svc && cargo run

# terminal 2
SELLER_SVC_MOCK=false npm run dev
```

## Deploy: header proxy wajib diisi

`adapter-node` di SvelteKit 3 **tidak lagi membaca env `ORIGIN`**. Kalau origin
tidak ditentukan, ia menyusunnya dari header `host` dengan protokol **default
`https`** — jadi di belakang proxy yang menterminasi TLS (Cloud Run), setiap
POST form ditolak `403 Cross-site POST form submissions are forbidden` kecuali
header proxy diteruskan:

```sh
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
```

Alternatifnya, tetapkan `kit.paths.origin` saat build untuk origin yang sudah
pasti. Pemeriksaan CSRF dilewati di `npm run dev`, jadi masalah ini hanya
muncul pada build produksi — dan muncul sebagai seluruh tombol _Setujui_ gagal.

## Mock data

`SELLER_SVC_MOCK=true` (bawaan) membuat seluruh pemanggilan seller-svc
mengembalikan data tiruan dari `src/lib/mock/fixtures.ts`, jadi aplikasi jalan
tanpa backend selama endpoint seller-svc masih 501. Isinya diambil dari kanvas
desain — Toko Kopi Jasa, Kopi Arabika, PO-0771 — supaya tampilannya sama dengan
rancangan. Setel `false` untuk memakai seller-svc sungguhan; jalur aslinya
sudah ditulis di `src/lib/server/api/`.

## Build plan

`seller-app` is the frontend half of **bikinlapak Seller** (PasStok): one
installable, mobile-first PWA for shop, stock, Asisten Stok and waste. The full
plan — app map, routing, PWA/realtime, design system, phases 0–12 — is in
[`docs/plan/`](docs/plan/README.md). The backend plan is in
[`../seller-svc/docs/plan`](../seller-svc/docs/plan/README.md).
