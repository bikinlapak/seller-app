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

## Deploy

### Proxy headers are mandatory

`adapter-node` in SvelteKit 3 **no longer reads the `ORIGIN` env**. If no
origin is set, it derives one from the `host` header assuming **https** — so
behind a TLS-terminating proxy (Cloud Run), every form POST is rejected with
`403 Cross-site POST form submissions are forbidden` unless the proxy headers
are forwarded:

```sh
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
```

Cloud Run's frontend sets both headers; the service env (managed by Terraform
in `../seller-svc/infra/run.tf`) tells the adapter to trust them. CSRF checks
are skipped in `npm run dev`, so this only bites in production builds — and it
shows up as every _Approve_ button failing.

### Manual deploy to Cloud Run

The `Makefile` runs the same flow as the pipeline (build → Artifact Registry →
Cloud Run) through your local `gcloud` CLI. The project is pinned to the
worksh playground, so it works regardless of your local gcloud config.

**Step 0 — set your environment first.** This is a frontend project: the
SvelteKit server reads `SELLER_SVC_*` from the environment at runtime, so
before building or running anything locally, prepare your env:

```sh
cp .env.example .env      # then edit: point SELLER_SVC_URL at your backend
```

- **Local dev / `node build`**: the `.env` values (or exported vars) are what
  the app uses — `SELLER_SVC_MOCK=true` (default) runs without a backend,
  `false` requires `SELLER_SVC_URL` to be reachable.
- **Docker build & Cloud Run**: `.env` is **deliberately excluded** from the
  image (`.dockerignore`) — no config or secrets are baked into image layers.
  The runtime env (`SELLER_SVC_URL`, `SELLER_SVC_AUDIENCE`, `SELLER_SVC_MOCK`,
  `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT`) is injected by Cloud Run and owned
  by Terraform — you never pass it on the command line.

```sh
# once per developer (an owner runs the grants):
gcloud auth login && gcloud auth application-default login
make grants GRANT_USER=<dev-email>

make vm-release    # full manual deploy, build on the runner VM (recommended)
make release       # same, but builds locally (needs docker with BuildKit)
make health        # verify: 200 on the public app
```

| Target                      | What it does                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `grants`                    | Owner-only: gives a developer AR writer + run.developer + actAs on the runtime SA    |
| `auth` / `base` / `vm-base` | AR docker auth; verify-or-build `bikinlapak-front-base:v1.0` (once per runtime bump) |
| `build` / `vm-build`        | Thin app image (`Dockerfile.app`), tagged with the commit SHA                        |
| `push` / `vm-push`          | Push to Artifact Registry                                                            |
| `deploy`                    | `gcloud run deploy` a new public revision (explicit `--service-account`)             |
| `health`                    | Plain public `curl /`                                                                |
| `release` / `vm-release`    | The whole chain                                                                      |

The `vm-*` targets sync the build context to the runner VM
(`github-runner`, asia-southeast1-c) and run `scripts/vm-*.sh` there — no
local docker needed. Public URL (stable across deploys):
`https://seller-app-staging-hv4r3oooeq-et.a.run.app`

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
