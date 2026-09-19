# hallelx2 labs — design system

**v10 · September 2026 · white first, one blue, every number measured**

This is the contract. `tokens.css` implements it. If the CSS and this file disagree,
the CSS is the bug.

Written to be handed to a builder — human or agent — with nothing else. Sections 1–3
are what to build against; 8–10 are the failures already paid for, and re-reading them
is cheaper than rediscovering them.

---

## 1. The aesthetic

White paper, one blue, and a black that only ever appears as text. The page is a
stack of full-bleed rounded cards floating on a near-white ground, each inset by a
single gutter token, with a fixed pill navigation riding above them. Metadata is
set in uppercase mono at 10–11px with wide tracking; headlines are a tight grotesque
run large enough to fill their measure. There is **no gradient anywhere** — no
`linear-gradient`, no `radial-gradient`, no blur, no blend mode. Every surface is one
solid token, which is why contrast on this site is an exact number rather than a
worst case. Photography enters only as a **halftone mask**: dithered to a dot screen
and painted as `background: currentColor` through a CSS mask, so an image is tinted
by a token like everything else. Corners are rounded rectangles and pills; there is
no blob, no squircle, no inverted corner. The signature is motion and measurement,
not shape.

**Tone of voice.** Short declaratives. A number in every claim, and the number is one
a reader could check. Never "revolutionary", never "seamless", never an em-dash-joined
tricolon. Where a measurement does not exist, the page says so in a styled panel
rather than estimating.

---

## 2. Where the tokens live

```
tokens.css          ← THE single source of truth. Colour, type, space,
                      radius, motion, and every @font-face.
assets/product.css  ← components: page chrome, cards, charts, tables
assets/nav.css      ← components: the navigation only
assets/nav.js       ← the nav's click / keyboard / Escape / outside-click
```

Load order is **not optional** — `tokens.css` first, always:

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="assets/product.css" />
<link rel="stylesheet" href="assets/nav.css" />
```

Next.js / Tailwind v4:

```css
/* app/globals.css */
@import "tailwindcss";
@import "../tokens.css";
```

There is no `tailwind.config.js` and there must not be one.

### One declaration site

**Nothing except `tokens.css` may declare `:root`, and nothing except `tokens.css`
may declare `@font-face`.**

This is not style preference. Before v10 there were two `:root` blocks — one in
`hallelx2-landing.html`, one in `assets/product.css` — and they had already drifted:
the landing had `--ink-navy` and no `--warn`; product.css had `--warn` and no
`--ink-navy`. The same happened to faces: the landing registered only
`HafferMono-Medium`, so every mono weight on that page silently snapped to Medium.

---

## 3. The three layers

**Layer 1 — tokens.** `tokens.css`, plain CSS custom properties on `:root` so a
future Expo/NativeWind app reads the same names and cannot drift. A `@theme inline`
block bridges each one to a Tailwind utility; `inline` matters, because it makes the
utility resolve to `var(--blue)` rather than copying the value — so re-pointing
`--accent` at runtime still re-themes everything.

**Layer 2 — components.** `product.css` and `nav.css`. Components reference
**semantic** names only.

**Layer 3 — usage.** Pages use components and semantic utilities. Never a hex,
never an `oklch()` literal, never an arbitrary `[14px]`.

> If you are typing a colour value inside a component, a token is missing. Add it to
> `tokens.css`.

### `--accent` is the theming hinge

Components read `--accent`, never `--blue`. Each product page re-points `--accent`
once, on the page root, and the whole page re-themes — nav pill, charts, buttons,
rules — with no component touched.

```css
.t-hc { --accent: var(--blue);  }   /* healthcare */
.t-ed { --accent: var(--green); }   /* education  */
.t-ai { --accent: var(--slate); }   /* AI         */
```

---

## 4. Colour, and why each value is what it is

Every pair below was computed in Python — sRGB → relative luminance → WCAG ratio —
never eyeballed. **4.5:1 for text, 3.0:1 for a meaningful graphic** (a border, a bar,
a rule, an icon that carries meaning).

| Token | Value | Role | Measured |
|---|---|---|---|
| `--white` | `#ffffff` | the ground | — |
| `--paper` | `oklch(97.5% .004 252)` | page ground | `--muted` on it: 5.59 |
| `--pale` | `oklch(96% .028 252)` | panel, open row | `--ink` on it: 14.78 |
| `--line` | `oklch(88% .035 252)` | hairline on light | 1.43 — **decorative only** |
| `--blue` | `oklch(53% .205 258)` | healthcare, brand | 5.43 on white |
| `--green` | `oklch(53% .130 152)` | education | 4.97 on white |
| `--slate` | `oklch(53% .060 262)` | AI | 5.29 on white |
| `--rule` | `oklch(82% .09 252)` | hairline **on** blue | 3.12 |
| `--sky` | `oklch(96% .028 252)` | quiet text **on** blue | 4.82 |
| `--ink` | `oklch(23.6% .002 68)` | the only black | 16.63 on white |
| `--muted` | `oklch(50% .005 78)` | secondary text | 6.00 on white |
| `--ink-navy` | `oklch(24% .1 258)` | survives blue **and** cloud | 3.05 / 16.58 |
| `--warn` | `oklch(52% .17 32)` | decline, caution, "before" | 5.31 on white |
| `--mute-bar` | `oklch(66% .02 252)` | a muted bar on white | 3.11 |

### Four rules that fall out of the measurements

1. **On the brand blue, hierarchy comes from size and tracking, never tone.** White
   is 5.43 and `--sky` is 4.82 — 0.61 apart. Nothing between them will read as a step.

2. **A muted→lit reveal cannot live on a saturated fill.** Both states must clear
   4.5, and the lit state tops out at 5.43. The scroll wipe is a light-ground effect
   only.

3. **`--line` is not a bar.** At 1.43:1 it vanishes as a chart element. 78% lightness
   is 2.00 and still fails. `--mute-bar` at 3.11 is the floor. A value label never
   takes the bar's fill.

4. **On the hero's cloud band, only `--ink-navy` works.** A white pill on white cloud
   measures **1.00:1** and a `--sky` outline measures **1.13:1** — both disappear.
   Navy clears both grounds (3.05 on sky, 16.58 on cloud). This is why the hero
   buttons and the aeroplane are navy.

---

## 5. Type

| Token | Value | Use |
|---|---|---|
| `--display` | Haffer → Archivo | headlines, body |
| `--mono` | Haffer Mono → JetBrains Mono | metadata, labels, eyebrows |
| `--mark` | Orbitron → `--display` | the `x2`, and headline figures only |

Haffer and Brisa Pro are **retail faces — buy a licence before any public deploy.**
The OFL stack behind them renders the system correctly, just not identically.

**Orbitron has a slashed zero.** It may set figures, never prose containing a `0`:
"Apache 2.0" rendered as "Apache 2.Ø" and had to be moved out of the mark face.

Scale, as actually set: `--t-hero` `clamp(34px,6.2vw,88px)` · `--t-h2`
`clamp(28px,4vw,56px)` · `--t-say` `clamp(24px,2.7vw,38px)` · `--t-lead`
`clamp(16px,1.35vw,21px)` · `--t-body` `clamp(15px,1.25vw,17.5px)` · `--t-meta`
`10.5px` uppercase, tracked `.11em`.

Mono metadata is weight **400**; only the flying banner is 500. Both files must be
registered or every weight snaps to whichever one is.

---

## 6. Layout

- **`--gutter`** `clamp(20px,4vw,72px)` — the page margin and the inset of every
  full-bleed card.
- **`--page`** `1320px` — the content column inside the gutter.
- **`--nav-clear`** `78px` — **any full-bleed card at the top of a page starts here,
  not at `--gutter`.** The nav is fixed 16px from the top and 50px tall, ending at
  66px; `--gutter` only reaches 66px at ~1650px wide. A hero set at `--gutter` was
  cut by the nav on every normal screen — 22px of overlap at 1100px.
- **`--r`** `clamp(16px,1.7vw,24px)` card · `--r-sm` 12px tile · `--r-xs` 3px chip ·
  `--pill` 999px.

---

## 7. Motion

Two curves. `--ease` `cubic-bezier(.19,1,.22,1)` for entering and settling; `--soft`
`cubic-bezier(.4,0,.2,1)` for colour and opacity. Durations `--d-fast` 220ms,
`--d-base` 440ms, `--d-slow` 900ms.

**Reveals fail open.** The hidden state is applied only once JS has added `.armed` to
`<html>`. If the script never runs, content is visible rather than permanently
invisible.

Everything folds under `prefers-reduced-motion: reduce`, and the fold is a real
layout, not just `animation:none` — the pinned deck becomes a static stack, the
flight parks mid-path, the progress rail is hidden.

---

## 8. Component conventions

Components live in `assets/product.css`, the nav alone in `assets/nav.css`.

- **Chrome is styled once.** The nav markup comes from `nav_html()` in
  `build-product-pages.py` and the CSS from `nav.css`. It previously existed in four
  places and had drifted — "Numbers" was in two of them. Never re-inline it.
- **Every variation is a variant, not a call-site override.** Category theming is
  `--accent`; a card that needs a different look gets a modifier class.
- **Scope a hero-only treatment to `.hero`.** The hero's buttons are restyled for the
  cloud band; those four rules are scoped so the closing plate keeps the original pair.
- **Both axes in CSS for a sized image.** `aspect-ratio` does **not** override an
  `<img>`'s `height` attribute — a portrait rendered 900px tall because of it.
- **`mask-size: cover`, never `100% 100%`.** The latter force-fits and squashed the
  hero cloud by 48% at 1440px and 73% on mobile.
- **`url()` in a custom property resolves against the stylesheet that declared it**,
  not the document. Set `mask-image` inline and keep only longhands in the sheet.

### Flex rows break in three predictable ways

All three have shipped here:

- A content-sized box beside a growable one loses; it needs `flex-shrink: 0` and the
  growable one needs `min-width: 0`. `flex: 0 0 auto` on the hero's button row made
  it refuse to shrink and the second pill ran off the edge at 390px.
- Nothing stops a label wrapping — two-word labels want `white-space: nowrap`, and
  then the row needs a defined behaviour for when it no longer fits.
- A border changes the box. Give the borderless sibling a transparent border rather
  than removing the other's.

---

## 9. Verification — the standing method

> **Measure, don't assert.** This caught a broken script, an undefined token, an
> invisible deck, a 22px nav overlap, four contrast violations and a silent font-weight
> collapse.

- Every contrast pair computed in Python before shipping the colour.
- Every layout checked at **390 / 1100 / 1440 / 1920**, never one width.
- Every change to shared CSS **pixel-diffed** against a frozen render of the previous
  state. Moving the tokens out of two `:root` blocks diffed to **0 px** on both the
  landing and a product page — that is what makes it a refactor rather than a redesign.
- Every page tag-balanced and link-checked after each edit. A string replace without a
  count once ate a `</div>` from a section I was not editing; only the balance check
  found it.

### Headless Chromium, the parts that cost time

- **CSS animations advance under `--virtual-time-budget`. CSS transitions do not.**
  An open dropdown measures `visibility:hidden` 900ms later with the selector
  demonstrably matching. Suppress the transition before measuring.
- **Scrolling does not work.** Simulate scroll-driven state by adding the class.
- **`url()` subresources are blocked under `file://`.** Serve over HTTP.
- **Never measure at `t=0`.** Reading a colour in the same tick you added the class
  returns the old value and looks exactly like a cascade bug.
- To screenshot one section, lift it into a probe file — but `[data-reveal] > *` is
  `opacity:0` and is **not** gated on `.armed`, so the probe renders blank unless you
  inject an `opacity:1 !important` override.

---

## 10. Explicit exclusions

- **Emails are never tokenised.** Clients strip CSS variables. Hardcode them.
- **No `--ok` token.** A positive state is `--accent`; a green tick would compete with
  education's green.
- **No dark theme.** One mode exists. Light-on-blue sections use `.on-c`, which is a
  *surface*, not a theme. Stated here as **not built**, not as a feature.
- **No gradients, blurs or blend modes**, other than `backdrop-filter` on the nav panel
  and the halftone dot screen.
- **Never invent a metric.** Where no measurement exists the page says so in a `.gap`
  panel. Four MB3 figures are deliberately unused because they appear in project docs
  but do not survive the live database.

---

## 11. Status

| Piece | State |
|---|---|
| `tokens.css` — single source | **Done.** One `:root`, one `@font-face` set, Tailwind bridge |
| `assets/product.css` | **Done.** Tokens removed, faces removed |
| `assets/nav.css` + `nav.js` | **Done.** One source, all 10 pages |
| Landing, 6 product pages, training ×2, about | **Done.** All tag- and link-clean |
| `hallelx2-design-system.html` | **Rebuilt on v10** — the living gallery |
| Dark theme | **Not built** |
| shadcn/Radix component layer | **Not built.** This repo is static HTML; the token layer is ready for it |
| `/how-we-work`, `/build-log`, `/the-ask` | **Not built.** `/the-ask` is blocked on a raise number |

### Files to delete before this ships anywhere

These are on the pre-v10 system and will mislead anyone who opens them:

```
hallelx2-landing-v2.html        hallelx2-design-system-v1.html
hallelx2-venture-studio.html    osmo-landing-recreation.html
hallelx2-hero-halftone.html     image*.png  (pasted screenshots)
```

`assets/SOURCES.md` stays — it is the provenance record for every figure on the site.
