/* Port the OpenDesign v10 static pages into this Next.js app.
 *
 * Reads the frozen HTML set from SRC, emits:
 *   src/module/site/views/<Name>View.tsx   converted JSX (header → <SiteNav/>)
 *   src/module/site/components/SiteNav.tsx generated from the landing header
 *   src/styles/{tokens,nav,product}.css    url() rewritten, retail faces stripped
 *   src/styles/pages/<slug>.css            per-page <style> blocks
 *   src/app/<route>/page.tsx               metadata + view
 *   public/js/<slug>.js                    per-page inline scripts, verbatim
 *   public/assets/**                       only the assets the v10 pages reference
 *
 * Re-run after a design revision: `node scripts/port.mjs`
 */
import { parseDocument } from "htmlparser2";
import fs from "node:fs";
import path from "node:path";

const SRC = process.env.OD_SRC ??
  "/home/hallelx2/dev/tools/open-design/.od/projects/240c474c-aa3f-4988-be63-7820b43deb83";
const ROOT = path.resolve(import.meta.dirname, "..");

const PAGES = [
  { src: "hallelx2-landing.html", route: "", view: "Landing", slug: "landing", cta: "Get in touch", active: null },
  { src: "hallelx2-products.html", route: "products", view: "ProductsIndex", slug: "products", cta: "Get in touch", active: "products" },
  { src: "hallelx2-libraries.html", route: "libraries", view: "Libraries", slug: "libraries", cta: "Get in touch", active: "libraries" },
  { src: "project-mercala.html", route: "projects/mercala", view: "Mercala", slug: "project-mercala", cta: "Get in touch", active: "products" },
  { src: "project-tether.html", route: "projects/tether", view: "Tether", slug: "project-tether", cta: "Get in touch", active: "products" },
  { src: "project-notebooklm.html", route: "projects/notebooklm", view: "NotebookLm", slug: "project-notebooklm", cta: "Get in touch", active: "products" },
  { src: "project-bridgehook.html", route: "projects/bridgehook", view: "Bridgehook", slug: "project-bridgehook", cta: "Get in touch", active: "products" },
  { src: "hallelx2-activity.html", route: "activity", view: "Activity", slug: "activity", cta: "Get in touch", active: null },
  { src: "hallelx2-how-i-work.html", route: "how-i-work", view: "HowIWork", slug: "how-i-work", cta: "Get in touch", active: null },
  { src: "hallelx2-stack.html", route: "stack", view: "Stack", slug: "stack", cta: "Get in touch", active: null },
  { src: "hallelx2-about.html", route: "about", view: "About", slug: "about", cta: "Get in touch", active: "about" },
  { src: "hallelx2-training.html", route: "training", view: "Training", slug: "training", cta: "Book a cohort", active: "training" },
  { src: "training-ai-in-practice-2026.html", route: "training/ai-in-practice-2026", view: "TrainingAiInPractice2026", slug: "training-ai-in-practice-2026", cta: "Book a cohort", active: "training" },
  { src: "hallelx2-design-system.html", route: "design-system", view: "DesignSystem", slug: "design-system", cta: "Get in touch", active: null },
  ...["voxtar", "aurahealth", "coursified", "hypatia", "mb3prepbot", "vectorless"].map((p) => ({
    src: `product-${p}.html`, route: `products/${p}`,
    view: p[0].toUpperCase() + p.slice(1) + "Product", slug: `product-${p}`,
    cta: "Get in touch", active: null,
  })),
];

const URL_MAP = new Map([
  ["hallelx2-landing.html", "/"],
  ["hallelx2-products.html", "/products"],
  ["hallelx2-libraries.html", "/libraries"],
  ["project-notebooklm.html", "/projects/notebooklm"],
  ["project-tether.html", "/projects/tether"],
  ["project-mercala.html", "/projects/mercala"],
  ["project-bridgehook.html", "/projects/bridgehook"],
  ["hallelx2-stack.html", "/stack"],
  ["hallelx2-activity.html", "/activity"],
  ["hallelx2-how-i-work.html", "/how-i-work"],
  ["hallelx2-about.html", "/about"],
  ["hallelx2-training.html", "/training"],
  ["training-ai-in-practice-2026.html", "/training/ai-in-practice-2026"],
  ["hallelx2-design-system.html", "/design-system"],
  ...["voxtar", "aurahealth", "coursified", "hypatia", "mb3prepbot", "vectorless"]
    .map((p) => [`product-${p}.html`, `/products/${p}`]),
]);

function rewriteUrl(u) {
  if (/^(https?:|mailto:|#|\/)/.test(u)) return u;
  const [pathPart, frag] = u.split("#");
  if (URL_MAP.has(pathPart)) {
    const base = URL_MAP.get(pathPart);
    return frag ? (base === "/" ? `/#${frag}` : `${base}#${frag}`) : base;
  }
  if (pathPart === "" && frag) return `#${frag}`;
  if (u.startsWith("assets/")) return `/${u}`;
  return u;
}

const rewriteCssUrls = (css) => css.replace(/url\((['"]?)assets\//g, "url($1/assets/");

/* ── attribute conversion ─────────────────────────────────────────── */
const ATTR_MAP = {
  class: "className", for: "htmlFor", tabindex: "tabIndex",
  srcset: "srcSet", autoplay: "autoPlay", playsinline: "playsInline",
  colspan: "colSpan", rowspan: "rowSpan", datetime: "dateTime",
  "xlink:href": "xlinkHref", crossorigin: "crossOrigin",
  readonly: "readOnly", maxlength: "maxLength", novalidate: "noValidate",
  autocomplete: "autoComplete", spellcheck: "spellCheck", contenteditable: "contentEditable",
};

function styleToObject(v) {
  const decls = v.split(";").map((d) => d.trim()).filter(Boolean);
  const entries = decls.map((d) => {
    const i = d.indexOf(":");
    const prop = d.slice(0, i).trim();
    let val = rewriteCssUrls(d.slice(i + 1).trim());
    let key;
    if (prop.startsWith("--")) key = JSON.stringify(prop);
    else {
      // camelCase; vendor prefixes: -webkit-x → WebkitX, -moz-x → MozX, -ms-x → msX
      key = prop.replace(/^-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (prop.startsWith("-") && !prop.startsWith("-ms-"))
        key = key[0].toUpperCase() + key.slice(1);
    }
    return `${key}:${JSON.stringify(val)}`;
  });
  return `{{${entries.join(",")}} as React.CSSProperties}`;
}

function emitAttrs(attribs) {
  let out = "";
  for (const [name, value] of Object.entries(attribs ?? {})) {
    if (name === "style") { out += ` style=${styleToObject(value)}`; continue; }
    const jsxName = ATTR_MAP[name] ?? name;
    let v = value;
    if (name === "href" || name === "src") v = rewriteUrl(v);
    out += /["\\\n{}<>]/.test(v) ? ` ${jsxName}={${JSON.stringify(v)}}` : ` ${jsxName}="${v}"`;
  }
  return out;
}

/* ── JSX emitter ──────────────────────────────────────────────────── */
// Elements whose HTML parsing relocates whitespace text nodes — emitting
// {" "} inside them makes the SSR DOM differ from the React tree (hydration #418).
const NO_WS_CHILDREN = new Set(["table", "thead", "tbody", "tfoot", "tr", "colgroup", "select", "optgroup"]);

function emitNode(node, ctx, parentName) {
  if (node.type === "comment") return "";
  if (node.type === "text") {
    if (/^\s*$/.test(node.data)) {
      if (node.data === "" || NO_WS_CHILDREN.has(parentName)) return "";
      return `{" "}`;
    }
    return `{${JSON.stringify(node.data)}}`;
  }
  if (node.type === "script") {
    const src = node.attribs?.src;
    if (src && src.includes("nav.js")) return ""; // loaded by the root layout
    if (!src) {
      const code = node.children.map((c) => c.data ?? "").join("");
      if (code.trim()) {
        ctx.scripts.push(code);
        // afterInteractive: the page scripts mutate the DOM, so they must run
        // after hydration — a pre-hydration mutation is reverted by React (#418).
        return `<Script src="/js/${ctx.slug}.js" strategy="afterInteractive" />`;
      }
      return "";
    }
    return `<Script src=${JSON.stringify(rewriteUrl(src))} strategy="afterInteractive" />`;
  }
  if (node.type === "style") {
    ctx.styles.push(node.children.map((c) => c.data ?? "").join(""));
    return "";
  }
  if (node.type !== "tag") return "";

  if (node.name === "header" && /\bnav\b/.test(node.attribs?.class ?? "")) {
    ctx.sawHeader = true;
    return ctx.headerReplacement ?? "";
  }
  if (node.name === "footer" && /\bfoot\b/.test(node.attribs?.class ?? "")) {
    ctx.sawFooter = true;
    return "<SiteFooter />";
  }

  const kids = node.children.map((c) => emitNode(c, ctx, node.name)).join("");
  return kids
    ? `<${node.name}${emitAttrs(node.attribs)}>${kids}</${node.name}>`
    : `<${node.name}${emitAttrs(node.attribs)} />`;
}

function findAll(node, pred, acc = []) {
  if (pred(node)) acc.push(node);
  for (const c of node.children ?? []) findAll(c, pred, acc);
  return acc;
}

const ensure = (p) => fs.mkdirSync(p, { recursive: true });
const write = (p, content) => { ensure(path.dirname(p)); fs.writeFileSync(p, content); };

/* ── shared CSS ───────────────────────────────────────────────────── */
let tokens = fs.readFileSync(path.join(SRC, "tokens.css"), "utf8");
// Retail faces (Haffer, Haffer Mono) are licensed, not shipped — HAL-1393.
// The OFL stack below them is the deployed rendering, per DESIGN.md §5.
tokens = tokens.replace(
  /@font-face\{font-family:'Haffer(?: Mono)?';[^}]*\}\n?/g,
  "",
);
tokens = "/* Retail @font-face (Haffer, Haffer Mono) removed for the public deploy — HAL-1393. */\n" + rewriteCssUrls(tokens);
write(path.join(ROOT, "src/styles/tokens.css"), tokens);
for (const f of ["nav.css", "product.css", "footer.css"]) {
  write(path.join(ROOT, `src/styles/${f}`), rewriteCssUrls(fs.readFileSync(path.join(SRC, `assets/${f}`), "utf8")));
}

/* ── assets ───────────────────────────────────────────────────────── */
const ASSETS = [
  "img/favicon.svg", "img/founder-gritty.jpg", "img/halftone.svg",
  "img/hero-campus.png", "img/hero-clouds.png", "img/hero-shelves.png", "img/hero-tower.png", "img/og-card.png",
  ...fs.readdirSync(path.join(SRC, "assets/img/marks")).map((f) => `img/marks/${f}`),
  ...fs.readdirSync(path.join(SRC, "assets/fonts/hallelx2")).map((f) => `fonts/hallelx2/${f}`),
];
for (const a of ASSETS) {
  const from = path.join(SRC, "assets", a);
  const to = path.join(ROOT, "public/assets", a);
  ensure(path.dirname(to));
  fs.copyFileSync(from, to);
}
ensure(path.join(ROOT, "public/js"));
fs.copyFileSync(path.join(SRC, "assets/nav.js"), path.join(ROOT, "public/js/nav.js"));

/* ── SiteNav, generated from the landing header ───────────────────── */
const landingDoc = parseDocument(fs.readFileSync(path.join(SRC, "hallelx2-landing.html"), "utf8"), {
  lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true,
});
const landingHeader = findAll(landingDoc, (n) => n.type === "tag" && n.name === "header")[0];
let navJsx = landingHeader.children.map((c) => emitNode(c, { scripts: [], styles: [], slug: "nav" })).join("");
// variance point 1: About link takes aria-current on /about
navJsx = navJsx.replace(
  `<a className="navlink" href="/about">{"About"}</a>`,
  `<a className="navlink" href="/about" aria-current={active === "about" ? "page" : undefined}>{"About"}</a>`,
);
// variance point 2: Training trigger takes aria-current on training pages
navJsx = navJsx.replace(
  `<button className="navlink" aria-expanded="false">{"Training"}`,
  `<button className="navlink" aria-expanded="false" aria-current={active === "training" ? "page" : undefined}>{"Training"}`,
);
// variance point 3: Products trigger takes aria-current on the products index
navJsx = navJsx.replace(
  `<a className="navlink" href="/libraries">{"Libraries"}</a>`,
  `<a className="navlink" href="/libraries" aria-current={active === "libraries" ? "page" : undefined}>{"Libraries"}</a>`,
);
navJsx = navJsx.replace(
  `<button className="navlink" aria-expanded="false">{"Products"}`,
  `<button className="navlink" aria-expanded="false" aria-current={active === "products" ? "page" : undefined}>{"Products"}`,
);
// variance point 4: the end CTA label ("Get in touch" / "Book a cohort")
navJsx = navJsx.replaceAll(`<span>{"Get in touch"}</span>`, `<span>{cta}</span>`);
if (!navJsx.includes("{cta}") || !navJsx.includes('active === "about"') ||
    !navJsx.includes('active === "training"') || !navJsx.includes('active === "products"') || !navJsx.includes('active === "libraries"'))
  throw new Error("SiteNav variance points did not all match — header markup changed upstream");

write(path.join(ROOT, "src/module/site/components/SiteNav.tsx"), `/* Generated by scripts/port.mjs from the v10 landing header — do not edit by hand.
 * The three variance points across all 10 pages are props: active, cta. */
export default function SiteNav({
  active = null,
  cta = "Get in touch",
}: {
  active?: "about" | "training" | "products" | "libraries" | null;
  cta?: string;
}) {
  return (
    <header className="nav on-c">
      ${navJsx}
    </header>
  );
}
`);

/* ── SiteFooter, generated from the landing footer ────────────────── */
const landingFooter = findAll(landingDoc, (n) => n.type === "tag" && n.name === "footer")[0];
let footJsx = landingFooter.children.map((c) => emitNode(c, { scripts: [], styles: [], slug: "foot" })).join("");
// the landing writes its section anchors page-locally; the shared footer must
// reach them from any route ("/#x" is still a same-document jump on "/")
footJsx = footJsx.replaceAll(`href="#numbers"`, `href="/#numbers"`).replaceAll(`href="#ask"`, `href="/#ask"`);
if (!footJsx.includes("/#numbers") || !footJsx.includes("/#ask") || !footJsx.includes("/products"))
  throw new Error("SiteFooter anchors did not all match — footer markup changed upstream");

write(path.join(ROOT, "src/module/site/components/SiteFooter.tsx"), `/* Generated by scripts/port.mjs from the v10 landing footer — do not edit by hand.
 * One footer for every page ("standard like the one on the home page", 2026-09-19).
 * "#top" works because every page's <main> carries id="top". */
export default function SiteFooter() {
  return (
    <footer className="foot">
      ${footJsx}
    </footer>
  );
}
`);

/* ── pages ────────────────────────────────────────────────────────── */
const summary = [];
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(SRC, page.src), "utf8");
  const doc = parseDocument(html, {
    lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true,
  });
  const title = findAll(doc, (n) => n.type === "tag" && n.name === "title")[0]
    ?.children.map((c) => c.data).join("") ?? "hallelx2 labs";
  const desc = findAll(doc, (n) => n.type === "tag" && n.name === "meta" && n.attribs?.name === "description")[0]
    ?.attribs.content ?? "";
  const usesProductCss = html.includes("assets/product.css");
  const body = findAll(doc, (n) => n.type === "tag" && n.name === "body")[0];
  // The category theme class (.t-hc/.t-ed/.t-ai → --accent) sits on <html> in the
  // originals; the root layout owns <html> here, so re-hang it on a boxless wrapper.
  const htmlEl = findAll(doc, (n) => n.type === "tag" && n.name === "html")[0];
  const themeClass = htmlEl?.attribs?.class ?? null;

  const ctx = {
    scripts: [], styles: [], slug: page.slug, sawHeader: false,
    headerReplacement: `<SiteNav${page.active ? ` active="${page.active}"` : ""}${page.cta !== "Get in touch" ? ` cta=${JSON.stringify(page.cta)}` : ""} />`,
  };
  const jsx = body.children.map((c) => emitNode(c, ctx)).join("");
  // collect any <style> that lived in <head> (emitNode only walked <body>)
  const headStyles = findAll(doc, (n) => n.type === "style")
    .map((n) => n.children.map((c) => c.data ?? "").join(""))
    .filter((s) => !ctx.styles.includes(s));
  const allStyles = [...headStyles, ...ctx.styles].filter((s) => s.trim());

  if (!ctx.sawHeader) throw new Error(`${page.src}: no <header class="nav"> found`);

  let cssImports = "";
  if (usesProductCss) cssImports += `import "@/styles/product.css";\n`;
  if (allStyles.length) {
    write(path.join(ROOT, `src/styles/pages/${page.slug}.css`), rewriteCssUrls(allStyles.join("\n\n")));
    cssImports += `import "@/styles/pages/${page.slug}.css";\n`;
  }
  if (ctx.scripts.length) write(path.join(ROOT, `public/js/${page.slug}.js`), ctx.scripts.join("\n\n"));

  write(path.join(ROOT, `src/module/site/views/${page.view}View.tsx`),
    `/* Generated by scripts/port.mjs from ${page.src} (OpenDesign v10) — do not edit by hand. */
${cssImports}${ctx.scripts.length ? `import Script from "next/script";\n` : ""}import SiteNav from "@/module/site/components/SiteNav";
${ctx.sawFooter ? `import SiteFooter from "@/module/site/components/SiteFooter";\n` : ""}

export default function ${page.view}View() {
  return (
    ${themeClass
      ? `<div className=${JSON.stringify(themeClass)} style={{ display: "contents" }}>
      ${jsx}
    </div>`
      : `<>
      ${jsx}
    </>`}
  );
}
`);

  const routeDir = page.route ? `src/app/${page.route}` : "src/app";
  write(path.join(ROOT, routeDir, "page.tsx"),
    `import type { Metadata } from "next";
import ${page.view}View from "@/module/site/views/${page.view}View";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(desc)},
};

export default function Page() {
  return <${page.view}View />;
}
`);
  summary.push(`${page.src} → /${page.route}  (styles:${allStyles.length} scripts:${ctx.scripts.length} productCss:${usesProductCss})`);
}
console.log(summary.join("\n"));
console.log("Ported", PAGES.length, "pages.");
