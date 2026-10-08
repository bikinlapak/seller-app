# seller-app

Seller dashboard for bikinlapak: product management and the online-store web builder. SvelteKit 3, Svelte 5 runes, Tailwind CSS 4, `adapter-node`. Backend: [seller-svc](../seller-svc).

```sh
cp .env.example .env
npm install
npm run dev        # http://localhost:5173 (needs seller-svc on :8080)
npm run check
npm test
npm run build && node build
```
