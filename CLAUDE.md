# CLAUDE.md

## What this is

The seller dashboard for bikinlapak: product management and the online-store web builder, with data from worksh.io via `../seller-svc`. Stack: SvelteKit 3, Svelte 5 runes, Tailwind CSS 4, `adapter-node` (not static: there's server-side load and, later, sessions).

**Everything is in English**: user-facing copy, code comments, identifiers,
and the API contract. This diverges deliberately from `../comingsoon`, which
is Indonesian — do not "fix" it back. Indonesian remains available as a
language option in AI settings, but English is the product's default.

## Commands

```sh
npm run dev       # dev server
npm run check     # svelte-check
npm run lint      # prettier --check
npm run format
npm test          # vitest (src/**/*.spec.ts)
npm run build     # output in build/, run with `node build`
```

## Architecture

- **Env vars** use the SvelteKit 3 mechanism: they're declared in `src/env.ts` (`defineEnvVars`) and imported from `$app/env/private`. `$env/*` no longer exists.
- **seller-svc is only called from the server side**, through `src/lib/server/seller-svc.ts` (`SELLER_SVC_URL`). Don't fetch seller-svc from the browser.
- **Dashboard shell**: the routes in `src/routes/(app)/` share `AppShell.svelte` (sidebar). The menu lives in `src/lib/nav.ts`. `/` redirects to `/beranda`.
- **Design tokens** in `src/routes/layout.css` are a subset of `../comingsoon/src/routes/layout.css`. Keep them in sync. The Tailwind 4 pitfalls in comingsoon's CLAUDE.md apply here too.
- **Imports** use `#lib/*` (Node subpath imports), not `$lib`. TS modules use a `.js` specifier: `#lib/nav.js`.
