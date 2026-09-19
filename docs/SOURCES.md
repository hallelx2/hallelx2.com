# Asset provenance

Everything in `assets/` was downloaded from the live osmo.supply (re-fetched
2026-09-17). Nothing is generated, redrawn, or a stand-in. All rights remain
with their owners; this directory exists for a local design study.

## Fonts — NOT licensed for redistribution
Commercial retail faces, self-hosted by osmo.supply. Fine locally; a public
deployment needs your own licence from the foundry.

| File | Family | Foundry |
|---|---|---|
| `fonts/Haffer-VF.ttf` | Haffer (variable, wght 100–1000) | Displaay Type Foundry |
| `fonts/HafferXH-Regular.woff2` | Haffer XH | Displaay Type Foundry |
| `fonts/HafferMono-Regular.woff2` | Haffer Mono | Displaay Type Foundry |
| `fonts/HafferMono-Medium.woff2` | Haffer Mono Medium | Displaay Type Foundry |
| `fonts/BrisaPro-Regular.woff2` | Brisa Pro | Latinotype |

## Video
- `video/osmo-reel.mp4` — the Osmo showreel ("Osmo in use"), the site's own
  compressed transcode. 1280×800, 35.5s. The live page labels the full reel
  00:48; the countdown in this build reads the shipped file's real duration.
- `video/res-*.mp4` (15) — resource preview clips from
  `osmo.b-cdn.net/resource-video/`. Loaded lazily and played on hover, which
  is how the real cards behave.
- `img/reel-poster.jpg` — a frame extracted from `osmo-reel.mp4` at t=3s so the
  player is never an empty box. Derived from the real asset, not invented.

## Images
- `img/res-*.avif` (15) — Vault resource thumbnails, `resource-img/`. 14 fill
  the hero radial marquee in the site's own order; Rive Setup heads the
  "Latest updates" slider.
- `img/vault-dashboard.jpg` — the Vault dashboard, `website/features/`.
- `img/product-card-*.avif`, `button-pack-product-card-*`,
  `page-transition-course-thumb-*` — membership product cards.
- `img/dennis-cutout-new.avif`, `img/ilja-cutout-new.avif` — Dennis Snellenberg
  and Ilja van Eck, Osmo's founders. Their own photography.
- `img/author-*.avif` — testimonial portraits: Dang Nguyen, Cassie Evans, Huy,
  Jordan Gilroy, Jesper Landberg, Victor Work. Quotes and roles are theirs,
  verbatim from the page.
- `img/showcase-*.avif` (5) + `img/credit-*.avif` — client sites in the
  "Made with Osmo" carousel, with their studio handles. The "N resources used"
  figure on each card is the count of that card's own `data-res-used-slug`
  entries on the live page, not an estimate.
- `img/quote-map-base.avif` + `img/map-{vnm,uk,aus,swe,ca}.svg` — globe base and
  country highlights. Slide→country binding read from the page's own
  `data-slide-map` attributes: VNM, UK, AUS, UK, SWE, CA.
- `img/osmo-logo.png` — Osmo wordmark. The asterisk mark is inlined as an SVG
  `<symbol>`, path lifted from the live page.
- `img/*-circle-deco*.svg`, `img/osmo-micrographic-*.avif`,
  `img/female-dev-subject.avif` — decorative rings, 3D objects, CTA subject.

## Figures taken from the live page, not estimated
- Pricing: Solo €25/mo billed quarterly, €20/mo billed annually; Team €16 per
  person/month, min 2 users. Quarterly and annually are the only cycles offered.
- "Join 3K+ others". 177 Vault resources.

## Deliberate divergence from the live site
The reference video shows a "Ready to level up?" closing section. The live site
has since replaced it with "Try the Osmo Demo Vault". This build follows the
video, since that was the brief.

---

## Hero halftone study — `hallelx2-hero-halftone.html`

Composition after a1mobile (reference video, `~/Downloads/90TIOXIbWVX4Dz07.mp4`).
Measured off it: page ground `#f7f6f1`, field `#086799`. The field on ours is
hallelx2 blue, not theirs.

| Asset | Source | Licence | Treatment |
|---|---|---|---|
| `assets/img/hero-tower.png` | Unsplash `photo-1473341304170-971dccb5ac1e` — transmission pylons at sunset | Unsplash Licence | cropped to the right-hand pylon, greyscale, hard threshold at **20%**, negated to an alpha mask. 20% was chosen by rendering 16/20/24/28/32% and comparing: below it loses lattice detail, above it drags in ground and cloud. |
| `assets/img/hero-clouds.png` | Unsplash `photo-1499346030926-9a72daac6c63` — cumulus bank from above | Unsplash Licence | 2200×406 (5.42:1, cut to the hero band's own aspect). `-crop 2600x480+0+560` for sky headroom above the cloud tops, greyscale, `-level 72%,97%` so the sky goes fully transparent rather than dithering into grey mud, multiplied by a `-sigmoidal-contrast 4,42%` ramp so the top dissolves with no straight edge, then `-ordered-dither h8x8a`, alpha from luminance, quantised. 29 KB. |
| `assets/icons/lucide/*` | [Lucide](https://lucide.dev) v0.544.0 | ISC (`LICENSE` alongside) | `plane` and `arrow-right` inlined; the rest kept for reuse. |
| `assets/img/halftone.svg` | generated | — | 4px two-dot tile, the screen over the flat field. |

The band is cut to 5.42:1 on purpose. It is used as a CSS `mask` at
`bottom center/cover`, never `100% 100%` — a forced 100%×100% squashed the
old 2.93:1 asset by 48% vertically at 1440px and by 73% on a phone, which
compressed the dissolve into a hard-edged band of noise. `cover` keeps the
aspect at every viewport and crops the sparse top instead of distorting it.

The clouds and tower were procedural SVG first. The photographs are both
better-looking and smaller — 68 KB against 192 KB for the generated cloud.

## Product pages

`product-*.html` are generated by `build-product-pages.py` from one template —
edit the PRODUCTS list there, not the HTML. They share `assets/product.css`.

Built for a business reader, not a technical one. Each page is: one claim,
three numbers, a **chart for every number**, and a short block of honest
chips. Anything needing a table lives in the `<details>` drawer. Body copy is
roughly 380&ndash;500 words per page (890 for MB3 Prepbot, which carries six
charts).

Charts are inline SVG emitted by helpers in the build script — no chart
library and no JavaScript, so they scale, print and cannot fail to load.
Two rules they enforce:

- **Two viewBox widths, 640 and 1360.** A single width made full-width cards
  stretch their SVG ~2&times;, rendering their text at twice the size of the
  half-width cards. The ratio of the two viewBoxes matches the ratio of the
  rendered widths, so text is the same visual size everywhere.
- **The "before" bar is `oklch(66% .02 252)`, 3.11:1 on white.** It was
  `var(--line)` (1.43:1) and then 78% lightness (2.00:1) — both invisible.
  Bar value text never uses the bar fill; it uses `--muted` (6.00) or
  `--warn` (5.99).

`assets/img/marks/mb3prepbot.svg` is drawn here, on the same 48-unit grid and
2px stroke as the other marks.

**Where each page's numbers come from.** Nothing is estimated.

| Product | Source of every figure |
|---|---|
| Vectorless | Four evaluation docs in `vectorless-engine/docs/evaluations/`, dated 2026-09-18 and 2026-09-19, corpus FinanceBench throughout; plus `pkg/parser/pdf.go` for how structure is recovered &mdash; positioned words with font size and bbox from `pdfgrab` (formerly published as `pdftable`), headings at 1.2&times; the document median type size, rows bucketed within 2pt, and a per-page table pass that emits each table as its own section. The unit it resolves to is a **section**, not a page. "No embeddings, no chunks, no similarity score" is the codebase's own statement (`pkg/tree/tree.go`); re-ranking is a model returning a score **and a reason** (`pkg/retrieval/rerank.go`), not a lexical heuristic; abstention is real (`abstained=true`, empty sections and citations). Note the *parser* does use typographic rules &mdash; those recover structure, they do not decide relevance, and the page keeps that distinction. Use cases and the buyer qualifier come from `vectorless-gtm/icp.md`; `/v1/replay`, the trace token and the byte-identical replay test are verified in `internal/api/treewalk.go` and its tests, and `path_correct@1` / sibling near-miss in `vectorless-bench`. **External market statistics in that memo are deliberately not reproduced on the page** — they are uncited there, so the section argues from failure mechanisms instead. Also `llmgate` (the Go LLM gateway) and the engine's concurrency, which is structural &mdash; worker pools, errgroups and semaphores, corpus run at parallelism 8. |
| MB3 Prepbot | Read-only queries against production (Neon), 19 September 2026. |
| Coursified | `apps/web/src/lib/plans.ts` for prices, the repository README for the pipeline, and the project strategy memo for positioning and the employer survey figures (Inside Higher Ed, BestColleges). **Unit build cost is deliberately not published** &mdash; it discloses margin and invites "so why am I paying you". |
| Voxtar | `services/pyzheimer` and `apps/backend` for the measurement set, the five indication models, the capture tasks and the seven-language bank &mdash; all counts verified in code, not taken from a plan doc. **No clinical figures**: the library carries no sensitivity, specificity or calibration for any model, and the drift figure on that page is a labelled schematic, not patient data. |
| Hypatia, AuraHealth | No figures. Repository state only. |

Four MB3 Prepbot figures are deliberately **not** used, because they appear in
project docs but do not survive the live database: the 1990&ndash;2024 question
range (the year column is filled on 330 of 4,752 rows), the 871 disputed count
(live total is 960), any exam duration (untimed papers sit open indefinitely),
and any group-drill engagement (the answers table is empty). They are listed
under "What we do not claim" inside that page's details drawer.

A CSS note that cost a render: a `url()` inside a custom property resolves
against **the stylesheet that declared it**, not the document. `--m:url('assets/…')`
read from `assets/product.css` resolved to `assets/assets/…`. The hero marks set
`mask-image` inline instead, with only longhands in the stylesheet.

## Training page

**`hallelx2-training.html` is a public marketing page and leads with what went well.**
Nothing on it is false, but it is a selection. The fuller picture is kept here so it is
not lost, and is the version to use with a studio or an investor.

### Attendance, counted properly

Curves come from the per-session `ivs` join/leave intervals in
`data/night{1,2,3}-attendance.json` — how many people were in the room at each
five-minute mark — not from the row counts. **Three notetaker bots per night are
excluded**, so the people figures are 88 / 54 / 35, not the raw 91 / 57 / 38.

| | Friday | Saturday | Sunday |
|---|---:|---:|---:|
| People (bots excluded) | 88 | 54 | 35 |
| Peak in the room | 59 | 34 | 24 |
| Present at 21:00 | 38 (64% of peak) | 21 (62%) | 14 (58%) |
| Stayed 60 min or more | 52% | 46% | 51% |
| Median stay | 66 min | 55 min | 61 min |
| Room emptied at | 21:53 | 21:59 | 21:11 |

The retention claim on the page is real: the *shape* held across all three evenings
even as the room shrank.

### What the public page leaves out

- Attendance fell 58% across the three nights, 91 to 38 (raw), 88 to 35 (people).
- The forecast got night one right (60–90 predicted, 91 actual) and the shape wrong —
  we expected it to peak on Sunday; it peaked on Friday.
- **Three feedback responses.** No satisfaction claim can be made, and none is made.
- WhatsApp restricted the account at 88 invites; 84 people were never reached that way.
- Ten late registrants never received a brief.
- One cohort, free, no revenue, no repeat data.

### The rest


`hallelx2-training.html` is generated by `build-training-page.py`, which imports the
chart helpers and page chrome from `build-product-pages.py` rather than copying them.

Every figure is from `~/dev/programmes/ai-in-practice-aug-2026`, read 19 September 2026:

| Figure | Source |
|---|---|
| 176 registrations, 71% one university, 78% health sciences, 70% thesis within 12 months | `planning/cohort-analysis.md` |
| Sign-up curve, 14&ndash;27 August | **Counted from `data/responses.json`**, not copied from a summary line &mdash; the per-day counts total exactly 176 |
| Attendance 91 / 57 / 38 | `data/night{1,2,3}-attendance.csv`, per-night meeting exports |
| Free, three evenings, recorded | `assets/body.html`, the email that actually went out |

Note `data/registrants.csv` has 236 physical rows because free-text answers wrap; the
registration count is 176 and comes from the parsed JSON, not `wc -l`.

The straight-talk block is the same exports read the other way: attendance fell 58%,
the forecast got night one right (60&ndash;90 predicted, 91 actual) and the shape wrong,
feedback came back from three people, and WhatsApp restricted the account at 88 invites.

## Hero bands, training split and the founder page

Two more halftone bands, both cut with the same recipe as `hero-clouds.png` —
greyscale, levels, a `-sigmoidal-contrast` ramp so the top dissolves with no straight
edge, `-ordered-dither h8x8a`, alpha from luminance, quantised.

| File | Source | Licence | Treatment |
|---|---|---|---|
| `assets/img/hero-campus.png` | Unsplash `photo-1562774053-701939374585` — university building | Unsplash Licence | 2200×471. `-crop 1400x300+0+235` to stop above the bright lawn, **negated** so the sky drops out and the façade stays solid, `-level 28%,70%`. 51 KB. |
| `assets/img/hero-shelves.png` | Unsplash `photo-1524995997946-a1c2e315a42f` — curved library shelves | Unsplash Licence | 2200×519, `-level 44%,88%`. 39 KB. |

Two candidates were rejected after looking at them rather than reasoning about them:
a dark auditorium had no bright-mass-over-empty structure and dithered either to
scattered noise or, inverted, to a solid white slab. **A stock portrait that came back
in the same search was discarded outright** — it is a photograph of someone who is not
the founder, and using it would have been a lie on the page that is most about trust.

`.phero .band` carries them: `mask-size:cover`, bottom-anchored, `mask-image` set
inline because a `url()` in a custom property resolves against the stylesheet.

### Page split

`hallelx2-training.html` is now an **index** of programmes; each programme that has
actually run gets its own page. `training-ai-in-practice-2026.html` is the first, and
carries all the attendance analysis. Both come from `build-training-page.py`.

### Founder page

`hallelx2-about.html`, from `build-about-page.py`. Every claim is evidenced on another
page of this site or in a repository, and each row of "The record" links to that
evidence. Nothing biographical is asserted that is not in evidence.

**The portrait is the founder's own photograph**, supplied 19 September 2026 and kept
untouched at `assets/img/founder.jpg` (800×800). `assets/img/founder-gritty.jpg` is the
version on the page: greyscale, `-sigmoidal-contrast 3.5,48%`, a Gaussian grain overlay
in Overlay mode, then a fine `-ordered-dither o4x4,8` screen.

It stays a photograph. An earlier pass masked the background out and ran the full
`h8x8a` halftone, which produced a handsome blue silhouette — and the wrong trade on
the one page where a reader wants to see the person. `founder-halftone.png` is still in
the folder if the silhouette is ever wanted.

A note kept from building the halftone version: a first attempt cut the background at
80% and produced an inverted portrait, because **in that colour space nothing in the
image is above 76%** — the threshold passed no pixels and the mask covered everything.
Measure the actual tones before choosing a cut point; the value that looks right in
sRGB is not the value the pipeline sees.

## Landing page positioning, 19 Sep 2026

Two passes on the same day. The first followed the positioning memo to **"Clinical AI
infrastructure."** and was rejected: it is generic, and it silently drops **research and
education**, which are two of the three fields the studio actually works in.

Settled positioning: **a portfolio across healthcare, research and education, on one
layer we own.**

- Hero: **"A portfolio, not a single bet."**
- Lead names all three fields, and the layer.
- Hero banner: the Vectorless FinanceBench figure → three studio-level numbers.
- Section 03 restructured again: the four memo pillars (AI, Healthcare research,
  Training, Computational research) became **three fields — Healthcare, Research,
  Education — with the AI layer moved underneath them** as the band. That is a truer
  reading of the memo than four peers, because AI is the substrate, not a field.

**Research is a pillar with no product**, and the page says so outright: *"Nothing ships
from this pillar — it is the standard the other two are held to."* That is what resolves
the apparent mismatch between three fields here and the deck's three product categories
(healthcare, education, AI).
- Section 03 was *"Three ways a benchmark lies"* — four cards of Vectorless benchmark
  methodology on the **company** landing page. Replaced by **"What we do"**: the four
  pillars (AI, Healthcare research, Training, Computational research) and a band for
  **HalleX Health Core**. The benchmark methodology already lives on the Vectorless
  page, including the "31% slower" result, so nothing was lost.

Two claims deliberately softened from the memo. The IRB at UCH is described as **an
application that is the current priority**, not an approval — the memo says approval is
the priority, not that it is held. And the research programmes (cervical screening,
oncology pharmacology, HIV genomics, the MNI template) are named as areas of work
inside a pillar, never as shipped products; the six-card deck remains the only place
that claims something is built.

## The navigation

`assets/nav.css` + `assets/nav.js`, markup from `nav_html()` in
`build-product-pages.py`. **One definition, used by all ten pages.**

It previously lived in four places — `product.css`, an inline copy in the landing,
and three separate `NAV` constants — and had already drifted: "Numbers" appeared on
the landing and the product pages but not on Training or About. That is why it is
centralised now. Do not re-inline it.

### Modelled on micro1.ai, read from their CSS

| Their behaviour | Verified in | Ours |
|---|---|---|
| Hover-open, no delay | `data-hover="true" data-delay="0"` | same, plus click/keyboard |
| Invisible hover bridge over the gap | `.nav_dd-ext{width:200%;height:150%;position:absolute}` | `.bridge`, ±24px wide, 22px tall |
| Translucent blurred panel | `.nav_dd_list{border:2px;backdrop-filter:blur(15px);border-radius:.75rem}` | same, 14px radius |
| Rich items: title + one-line description | `.nav_dd_title` / `.nav_dd_desc` | `.mi b` / `.mi i`, plus the product mark |
| Item background fade | `.nav_dd_item{transition:background-color .3s}` | same |
| Chevron rotates | `.nav_menu-icn{transition:transform .2s}` | same |
| Two-layer CTA label for a text swap | label duplicated in markup | `.nav .end span + span` |

Hover alone is not accessible, so the trigger is a real `<button>` with
`aria-expanded`, and `nav.js` adds click, Escape and outside-click. The mobile CTA
stays in the pill rather than being hidden — hiding it removes the only conversion
path on the device most readers will use.

### Two things that cost time

**`--accent` was only defined in `product.css`.** Moving the nav into a shared file
broke the landing's pill to a transparent box, because `background:var(--accent)`
had nothing to resolve to. The landing's `:root` now defines it.

**CSS transitions do not advance under `--virtual-time-budget`.** A headless probe
showed the open panel stuck at `visibility:hidden; opacity:0` even 900ms after the
class was added, and the selector demonstrably matched. It was not a cascade bug —
suppress the transition (`el.style.transition='none'`) before measuring or
screenshotting, or the element stays frozen at its start value. Animations *do*
advance; transitions do not.

### Landing structure, after the three-field pass

The blue band under "What we do" was carrying three unrelated arguments in one
paragraph — naming three libraries, claiming nothing rebuilds them, and making a
clinical-safety point. That is why it read as odd. It was split:

| Was in the band | Now |
|---|---|
| The three libraries | **Section 04 — "The layer we own"**, one card each, with licences |
| "Nothing above rebuilds them" | The one-line band closing section 04 |
| "AI drafts, a clinician signs" | The Healthcare card in section 03, where it belongs |

Sections added at the same time, because the landing had no route to two pages that
already existed:

- **04 The layer we own** — Vectorless (Apache 2.0), llmgate (Apache 2.0), pdfgrab (MIT).
- **05 Training** — 176 / 3 of 3 / 6 in 10, linking to the training pages.
- **06 Who is behind it** — the portrait and one line, linking to the founder page.

Two components were added to the landing's inline CSS for these: `.strip` (a row of
figures with a CTA) and `.person`. Everything else reuses `.traps`/`.trap` and
`.against`, which already existed.

**A layout trap worth remembering:** `.person img` was set with `width` plus
`aspect-ratio:1`, and rendered 900px tall. The `<img>` carries `width="900"
height="900"` attributes for layout stability, and **`aspect-ratio` does not override an
HTML `height` attribute** — both axes have to be set in CSS. The section measured
1286px before the fix and 544px after.

## Landing 06 — the founder card, rebuilt at section-03 scale (19 Sep)

The card was a thumbnail beside one line and read as filler next to the full
blocks in 03. Rebuilt on the same scale:

| Part | Before | After |
|---|---|---|
| Portrait | `clamp(96px,11vw,150px)` square | `clamp(200px,30vw,430px)` square, `object-position:50% 22%` so the crop holds the face |
| Statement | 23px, one line | `clamp(24px,2.7vw,38px)`, two-tone with `.dim`, 18ch |
| Body | none | one paragraph, 52ch |
| Facts | none | 6 products · 3 libraries · 1st at WACP, pinned to the bottom of the text column with `margin-top:auto` so the column reaches the portrait's height |

Figures are all carried elsewhere on the site: the six products are the deck in
`#products`, the three libraries are section 04, and the WACP placing is on the
Voxtar and About pages. Nothing new was introduced here.

Column balance measured at three widths (portrait bottom vs text bottom):
1440px 662 / 740, 1100px 518 / 617, 390px stacked. Below 640px the portrait goes
full-width with `aspect-ratio:1`.

Probe gotcha worth keeping: `[data-reveal] > *{opacity:0}` is **not** gated on
`.armed` on the landing, so a section lifted into a standalone probe file renders
blank — the IntersectionObserver that adds `.in` never runs. Inject an
`opacity:1!important;transition:none` override into the probe before screenshotting.

## Landing footer — rebuilt, and the wordmark measured onto the grid (19 Sep)

Two separate left-biases, both measured from a render at 1440px:

1. `.foot-nav` was a flex row of four 145px columns in a 1320px container —
   they packed into the left ~700px and left ~580px of dead air. Now a grid,
   `minmax(260px,1.6fr) repeat(4, minmax(120px,1fr))`, with a statement column
   first so the width is filled by content rather than by stretched gaps.
2. The wordmark used `font-size:clamp(56px,15vw,230px)`, which is sized off the
   **viewport** while the container is `min(1320px, 100vw - 2*gutter)` — so it
   stopped 240px short of the right edge.

   Fixed by sizing it off the container instead:
   `font-size: min(calc((100vw - 2*var(--gutter)) / var(--K)), calc(1320px / var(--K)))`

   `--K: 4.667` is the measured width-to-font-size ratio of "hallelx2" in Archivo
   at `letter-spacing:-.05em` — taken from a render (1008px of ink at 216px type).
   Verified by measuring the ink extent against the container edges:

   | Viewport | Container | Mark ink | Right shortfall |
   |---|---|---|---|
   | 1440px | 58 → 1382 | 60 → 1379 | 3px |
   | 1100px | 44 → 1056 | 44 → 1055 | 1px |
   | 390px  | 20 → 370  | 20 → 369  | 1px |

   If the face, weight or tracking of the mark ever changes, re-measure K — it is
   the one number in this file that is a property of the font, not of the data.

The "Email" item was dropped from the Elsewhere column: the address is now printed
in full in the statement column, two columns to its left.

## Landing 06 — portrait now flush with the text column

`align-self:stretch` + `height:auto` + a `min-height` floor. The square version
finished 78px above the text column at 1440px, which read as an alignment mistake.
The image is no longer strictly square above the floor — matching the column's
height was the explicit ask, and flush top-and-bottom is what makes it read as
deliberate.

## Landing hero — the positioning line (19 Sep)

Replaced "A portfolio, not a single bet." with the line as given:

> Building the products healthcare, education and the AI ecosystem needs.

Also applied to `<title>` and the meta description, so the three surfaces agree.
The lead now carries the portfolio point that the old h1 carried:
"Six of them, standing on three open-source libraries we wrote and released — a
portfolio, not a single bet, with every claim on this site measured in public."

`.hero h1` measure widened 13ch → 19ch. The old measure was cut for a four-word
headline; at 13ch the new line broke into six. Rendered at three widths: three
lines at 1440px, three at 1100px, six at 390px, no overflow.

A manual `<br>` was tried first and removed — it held at 1440px and broke the
rhythm at every other width. The measure does the wrapping.

**Open inconsistency, deliberately not resolved here.** The hero now names
healthcare / education / the AI ecosystem; section 03 names healthcare /
research / education. They are reconcilable — 03's Research card already says
"Nothing ships from this pillar; it is the standard the other two are held to",
and the AI ecosystem is section 04's three libraries — but a visitor two screens
apart sees two different triads. Changing 03 is a positioning call, not a copy fix.

## Landing hero — plain-language lead, and a real aeroplane (19 Sep)

**The lead** named the machinery ("six of them, standing on three open-source
libraries"), which only lands with someone who already knows what a retrieval
library is. Rewritten as three things a reader can picture, with the count last:

> A doctor whose notes are written by the time she leaves the bedside. A student
> drilled every morning before finals. The one paragraph that matters, found in a
> 200-page report in seconds. **Six products, all of them working today** — and
> every number on this page is a real one.

Each clause is a product that exists: Voxtar, MB3 Prepbot, Vectorless. The
libraries are still named in the footer and in section 04, where a reader who
cares about them will look.

**The aeroplane** was a 24×24 Lucide stroke icon flying at `top:12%` — in flat
blue sky, well above the clouds, which occupy the bottom 36% of the hero. Two
changes:

- `.flight` moved to `bottom:clamp(90px,22%,220px)` so it crosses the cloud band.
- The icon is now one filled path — a swept airliner seen from above.

The silhouette took two passes. The first used a `0 0 640 200` viewBox, and at
58px wide it rendered 18px tall and read as a dart, not a plane: **an airliner's
wingspan is roughly equal to its length**, so the viewBox has to be near square.
Second pass is `0 0 512 512`, span 452 against length 478, at
`width:clamp(46px,5vw,74px)` with `height:auto`.

The path points right in the source and is flipped with `scaleX(-1)`, because
`@keyframes fly` travels 104vw → −62vw, right to left. A square `height` would
squash it — height must stay auto.

The banner pill gained `box-shadow:0 2px 12px` and the plane a `drop-shadow`:
both now sit on white cloud rather than flat blue, and needed an edge to hold.

## Landing hero — the lead cut back (19 Sep)

The plain-language rewrite above traded one problem for another: three scene-setting
clauses ran to **six lines** at 1440px and buried the headline. Cut to one:

> **Six products, all working today.** Every number on this page is a real one.

14 words. The scenes it replaced are not lost — each was a product, and each has
its own page with the evidence on it. The hero's job is the headline, one line of
proof and two buttons.

`.hero .lead` measure widened 40ch → 78ch. The 40ch measure was cut for the long
version and broke the one-liner across two lines for no reason; at 78ch it holds
one line on desktop and still wraps on a phone, where the viewport is the narrower
constraint.

## Landing hero — the plane flies through the clouds (19 Sep)

Asked for: lower, and passing through the band so it is hidden at some points and
visible at others.

One cloud layer cannot do this — a mask cannot occlude a sibling that paints after
it. The band is now drawn **twice**, with the plane between the copies:

| Layer | z-index | Where | Drift |
|---|---|---|---|
| `.clouds` | 1 (inside `.cloud-wrap`) | behind the plane | `drift` 54s, −4% |
| `.flight` | 2 | `bottom:clamp(32px,9.5%,100px)` | `fly` 30s |
| `.clouds-front` | 4 | in front of the plane | `driftfront` 31s, −9% |

`.clouds-front` must be a **sibling of `.flight`, not a child of `.cloud-wrap`**:
cloud-wrap is positioned with a z-index, so it opens a stacking context and nothing
inside it can rise above a z-index 2 element outside it.

It reuses the same PNG at a different scale and anchor — `bottom left/168% auto`
against the back layer's `bottom center/cover` — so the tufts do not line up and
the plane vanishes into a near cloud and reappears through a gap. The front layer
also drifts faster (31s/−9% vs 54s/−4%); that difference is what reads as depth
rather than as two copies of one picture.

Verified by rendering six frames along the flight path with the animations paused
at `animation-delay: -9s … -20s`. Across the six: fully clear over blue, nose
entering a mass, broken up mid-cloud, and one frame where only the banner is
visible. Frame sheets were the only way to check this — a single screenshot says
nothing about an effect that is defined over the whole cycle.

Two earlier passes were wrong and are worth not repeating: at `bottom:22%` and
then `16%` the plane flew **above** the front tufts and was never occluded at all.
`9.5%` puts it in them. `opacity:.95` on the front layer was also dropped — at full
opacity the dense parts hide the plane outright instead of misting it.

The banner pill stays readable throughout: it is white with ink text over a
dithered mask, and the `box-shadow` added earlier holds its edge.

## Product pages — "Why it exists" (19 Sep)

Six origin accounts, dictated by Halleluyah in the first person and kept in his
voice. They live in `ORIGINS` in build-product-pages.py, keyed by slug, and
render as **section 01 on every product page** — ahead of "Where it is". The
problem comes before the product, so a reader who does not have the problem can
stop there.

| Product | The problem he hit |
|---|---|
| Coursified | Courses cost more than he had and missed what he needed; YouTube taught him a lot but has no order |
| Hypatia | The first week of a new field, when the explanations are written in the field's own vocabulary |
| Voxtar | The voice changes before anyone notices, and almost nobody measures it |
| Vectorless | Chunk, embed, rank, hope — no way to know whether the right passage was found |
| AuraHealth | Patients walking a teaching hospital end to end before anyone asks what is wrong |
| MB3 Prepbot | The same mountain of past questions his whole class faced |

Nothing here is a performance claim. Where a paragraph touches a number — MB3's
paying users, the distinction in O&G — that number appears with its source
further down the same page.

Layout is `.origin` in product.css: pull line left at heading scale, the account
right at reading scale, two independent flex items so the line need not be short
enough to sit above the prose.

## Nav — the Training panel has marks (19 Sep)

`NAV_TRAINING` passed `None` for its mark while every product item had one, so
the Training panel rendered as a bare list and looked like a different component.
Two new marks, built to the house construction (48×48, `fill:none`,
`stroke:currentColor`, width 2, round caps — same as voxtar.svg et al):

- `marks/programmes.svg` — a calendar with two filled rows
- `marks/cohort.svg` — a figure flanked by two at 40% opacity

`NAV_TRAINING` tuples are now 4-wide `(href, mark, title, desc)`. The landing's
embedded nav was resynced from `nav_html()`; diffed against the previous copy,
the only change was the two new `.mk` spans, which confirms the landing had not
drifted.

## Landing — the plane joins the mark set, portrait back to square (19 Sep)

**The plane** was a filled silhouette on a page where every other glyph is line
art. Redrawn to the house construction: 48×48, `fill:none`, stroke 2, round caps,
five strokes — fuselage, two wings, two tailplanes. It still flips with
`scaleX(-1)` and is still occluded by `.clouds-front`.

**The portrait** in section 06 goes back to a square, `clamp(200px,32vw,460px)`
on both axes. Stretching it to the text column's height made it a rectangle,
which is not a shape this brand uses. At 460px the two columns now finish within
48px of each other, which was the point of the stretch in the first place.

## About page — the bio was wrong, and is rewritten (19 Sep)

The "short version" paragraph invented origins that contradict what Halleluyah
actually described. Two of the three were wrong:

| It said | The truth |
|---|---|
| Voxtar exists because clerking is two jobs at once | Voxtar is voice biometrics, not clerking software. It exists because a voice changes before anyone notices and almost nobody measures it. This is the **second time** this error has appeared — it was corrected once before from the repo |
| Coursified and Hypatia exist because 176 people gave up three evenings | That is the training arm, a separate thing. Coursified came from courses costing more than he had and YouTube having no order; Hypatia from the first week of a new field |
| MB3 Prepbot exists because he was revising for the same exam | Close enough to stand, and now phrased as he put it: the same mountain of past questions his class faced |

Every sentence in the new bio matches the `ORIGINS` block in
build-product-pages.py, which is his own dictation. **The two cannot drift apart
without one of them being edited on purpose** — that is the point of keeping the
wording parallel rather than paraphrasing.

The last two paragraphs were kept as they were: "I publish what the measurement
said, including when it went against me" and "what I am short of is runway" are
both supported — the training page does show attendance falling, and the
Vectorless evaluations do include the run that made retrieval worse.

`.who .pic` grew from `clamp(150px,19vw,240px)` to `clamp(200px,29vw,430px)` and
`.who` is now `align-items:center` — a portrait rather than a thumbnail, matching
the founder card on the landing. Still square; it was always square, just small.

## Landing hero — the right half was empty (19 Sep)

The copy column ended around 45% of the width; everything right of it was flat
blue. `.hero-copy` is now two columns: copy left, **the six products right** as a
2×3 grid of mark-plus-name tiles, each linking to its page. Navigation and proof
in the same object, and no extra prose — which matters on a hero that was just
cut back to one line.

Tiles are `oklch(100% 0 0 / .12)` on the brand blue, lifting to `.22` on hover,
with the product's own mark as a CSS mask in `currentColor`.

**Four attempts on the headline**, because narrowing the copy column changed its
wrapping. Worth recording so it is not relitigated:

| Attempt | Result |
|---|---|
| Right column 380px, `max-width:19ch` | 4 lines, first line stranded at "Building the" |
| `text-wrap:balance` | No change — balance keeps the line count greedy wrapping produced |
| `max-width:24ch`, right column 340px | First line full; last line a lone "needs." |
| `font-size:clamp(28px,3.8vw,53px)` | Three lines — **but** the copy block shrank and opened a vertical void between the buttons and the clouds. Worse than the problem being solved. Reverted |

Shipped: full size, `max-width:24ch`, right column 340px, `text-wrap:pretty`.
Four lines, last line "needs." — `pretty` cannot lift it, because line 3 plus
"needs." is 910+250 against a 940px column. Left as a hard full stop, which is a
deliberate-looking editorial break rather than an accident.

The measurement that settled it: at 1440px the four lines are 810 / 812 / 802 /
250, total ink ~2674px against a 940px column. Three lines need ~890 each, which
only fits below 54px type.

## Landing hero — REVISED: filled with type, not with objects (19 Sep, later)

The product-tile column added above was **removed on request**. The note stands
as a record of what was tried; the shipped answer is different, and simpler:
the answer to an empty half is bigger type, not another object.

    .hero h1{max-width:none;             /* the hero padding box is the measure */
      font-size:clamp(34px,6.2vw,88px);  /* was clamp(28px,4vw,56px) */
      line-height:1.02;letter-spacing:-.035em;text-wrap:pretty}

`.hero-copy` is a plain block again; `.hc-l`, `.hc-r`, `.pts` and `.pt` are gone
from both the markup and the stylesheet.

Measured by taking the horizontal extent of pure-white pixels per row in the
render, so "it fills the width" is a number rather than an impression:

| Viewport | Measure | Longest line | Fill |
|---|---|---|---|
| 1440px | 1274px | 1198px | 94% |
| 1100px | 1012px | 927px | 92% |
| 390px | 350px | 288px | 82% |

The 88px cap was picked from the measurement, not by eye: at 78px the longest
line came to 1072px and left 200px of measure unused.

Still three lines with a short third. At this scale that rag is the composition
rather than a defect — and the earlier attempt to remove it by shrinking the type
to 53px is what opened the vertical void in the first place.

## Landing hero — the lead and the buttons share a row (19 Sep)

Marked region was the open wedge to the right of the headline's last line
("needs."). The lead and the button row were stacked in the left third below it,
so the whole lower half of the hero sat in one corner.

`.hero-foot` wraps the two into a single `justify-content:space-between` row:
lead left, buttons pushed to the right edge. The three elements now span the
hero instead of piling up.

**Not done, and why:** the buttons were not set inline on the headline's last
line. That would mean hard-coding where the headline breaks, and the break moves
with viewport width — the same failure mode as the `<br>` that was tried and
pulled earlier in this file.

**Contrast, measured before changing anything:**

| Pair | Ratio | Needs |
|---|---|---|
| ghost outline `--sky` on `--blue` | **4.82:1** | 3.0 (meaningful graphic) |
| ghost label `#fff` on `--blue` | **5.43:1** | 4.5 (text) |

Both already passed. The ghost button read faint because it is a one-pixel
outline standing next to a solid white pill, so the fix was weight rather than
colour: `inset 0 0 0 1.5px`, scoped to `.hero` so the ask section is untouched.

One regression caught by rendering at 390px: `.hero-actions{flex:0 0 auto}` sized
the row to both pills side by side and refused to shrink, so the second pill ran
off the edge. `flex:0 1 auto;min-width:0` lets the row shrink and its own
`flex-wrap` then stacks the pills. Checked at 390 / 560 / 820 / 1440 — the foot
row wraps below ~760px of hero width, which is correct.

## Landing hero — REVISED AGAIN: buttons on the cloud, rows evenly spaced (19 Sep)

The `.hero-foot` row from the note above was **reverted**. What was wanted was
the button row carried *down onto the cloud band*, with the three horizontal
rows — headline, lead, buttons — spaced equally down the hero.

    .hero{ ... padding-bottom:clamp(110px,15vh,170px)}   /* was clamp(150px,30vh,300px) */
    .hero-copy{flex:1;display:flex;flex-direction:column;justify-content:space-between}

The h1 and lead bottom margins were zeroed; `space-between` does the spacing now.
Measured at 1440px by scanning rows for non-background pixels: headline ends 406,
lead 532-549, buttons ~660. Gaps of **126px and 111px** — equal within 13%, the
residue being line-box leading around the type.

The bottom padding is set against the flight path, not by eye: the plane sits at
`bottom:clamp(32px,9.5%,100px)` and is ~70px tall, so 15vh keeps the button row
clear of it while still landing the row on cloud.

**The buttons had to be restyled, and the measurement forced the choice.** The
row now crosses both flat blue sky and white cloud:

| | vs sky blue | vs white cloud |
|---|---|---|
| white pill | 5.43:1 | **1.00:1** — invisible |
| ghost outline `--sky` | 4.82:1 | **1.13:1** — invisible |
| navy `oklch(24% .1 258)` | 3.05:1 | 16.58:1 |

Navy is the only value that holds on both, so it became a `:root` token
`--ink-navy` (the plane was already using the literal). Primary is a solid navy
pill, white label at 16.58:1. Secondary keeps a white fill so its label reads at
16.63:1, and takes a 1.5px navy outline — which is the part that gives it an
edge once it is over cloud.

All four rules are scoped to `.hero`, so the `.ask` section at the foot of the
page keeps the original white-on-blue pair.

## Design system v10 — consolidated for the build (19 Sep)

Three artefacts, meant to be handed to a builder with nothing else:

| File | What it is |
|---|---|
| `tokens.css` | THE single source of truth — 41 tokens, 15 colours, 7 faces |
| `DESIGN.md` | The written contract. If the CSS disagrees with it, the CSS is the bug |
| `hallelx2-design-system.html` | The living gallery, **generated** by `build-design-system.py` |

### The drift this closed

There were **two `:root` blocks** and they had already diverged — the landing had
`--ink-navy` and no `--warn`; `assets/product.css` had `--warn` and no `--ink-navy`.
Faces were worse: the landing registered only `HafferMono-Medium`, so every mono
weight on that page silently resolved to Medium.

After consolidation, verified by grep for an actual declaration rather than a prose
mention:

    :root declarations  : 1   (tokens.css:55)
    @font-face blocks   : 7   (tokens.css, all one set)

### Verified as a refactor, not a redesign

Every page was pixel-diffed against a frozen render of its previous state — all
motion paused, reveals forced visible, same viewport:

| Page | Diff |
|---|---|
| `hallelx2-landing.html` | **0 px** |
| `product-vectorless.html` | **0 px** |

Getting to zero took two corrections, both found by the diff and neither by reading:

1. **A component rule in the token file.** A `.wm` wordmark block set
   `letter-spacing` on the `x2`, collided with the wordmark the nav already styles,
   and shifted every nav item 4px. Removed — `tokens.css` declares tokens and loads
   faces, nothing else, and now says so in a banner comment.
2. **A font-weight change that was actually a fix.** 3,452 px of difference across
   four 8px-tall bands turned out to be mono metadata rendering at weight 400 instead
   of snapping to Medium, because `tokens.css` registers both `HafferMono-Regular`
   and `-Medium` where the landing registered only `-Medium`. Accepted deliberately:
   the old render was the bug.

### The gallery is generated, on purpose

`build-design-system.py` parses `:root` out of `tokens.css` and computes every
contrast ratio on the page with the same OKLch → linear sRGB → luminance → WCAG
chain used everywhere else in this project. No number on that page was typed by
hand, so the gallery cannot claim one thing while the system does another. Add or
re-value a token and re-run it.

One trap repeated from earlier in this project and now designed out: the page
template carries literal `%` (`100%`, `48%`, `60%`) in its CSS, which breaks Python
`%`-formatting. The template uses `@@TOKEN@@` replacement instead, so a percent sign
appearing in future content cannot break the build.
