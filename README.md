# hallelx2.com

The hallelx2 labs site — landing, six product pages, training, about, and the
living design-system gallery. Live at [hallelx2.com](https://hallelx2.com).

## Where the design comes from

The pages were designed as static HTML in OpenDesign under the v10 token
system. [docs/DESIGN.md](docs/DESIGN.md) is the design contract;
`src/styles/tokens.css` is the single declaration site for colour, type,
space, radius, motion and every `@font-face`. Nothing else may declare
`:root` or `@font-face`.

`scripts/port.mjs` converts the frozen HTML set into this app. To pick up a
design revision, point `OD_SRC` at the OpenDesign project directory and re-run:

```bash
node scripts/port.mjs && bun run build
```

Generated files (views, `SiteNav`, page styles, page scripts) carry a
"generated" header — edit the source design or the porter, not the output.

## Architecture

- Next.js App Router, TypeScript, all routes statically prerendered.
- **Deliberate MPA**: internal links are plain `<a>` full-page loads. Each
  route's inline script must re-run on entry and per-route CSS must not leak
  across navigations, so `<Link/>` client navigation is intentionally not used.
- Page behaviour scripts load via `next/script` `afterInteractive` — DOM
  mutations before hydration get reverted by React.
- No Tailwind: the pages use no utilities, and Tailwind preflight would drift
  the rendering the v10 contract froze. The `@theme` block in `tokens.css` is
  inert here and activates if a Tailwind layer is ever added.

## Fonts

Haffer and Brisa Pro are retail faces and are **not in this repo**; the site
ships the self-hosted OFL stack (Archivo, Inter, JetBrains Mono, Orbitron),
which the design contract specifies as the correct fallback rendering.

## Commands

```bash
bun install
bun run dev     # dev server
bun run build   # production build (the gate)
bun run start   # serve the production build
bun run lint
```
