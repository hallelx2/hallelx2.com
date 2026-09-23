/* Structured data for the site.
 *
 * Hand-written, and the only place these facts live — scripts/port.mjs reads
 * this to emit a <JsonLd> into every generated page.tsx.
 *
 * The rule that governs everything here is the same one that governs the
 * copy: nothing is asserted that cannot be checked. No aggregateRating, no
 * download counts, no datePublished invented for a page whose date nobody
 * recorded. Where a fact is unknown the property is omitted, because an
 * absent property costs nothing and a wrong one is a lie a machine will
 * repeat.
 */

export const SITE = "https://hallelx2.com";

/** One canonical id for the person, referenced by every other node. */
export const PERSON_ID = `${SITE}/#halleluyah`;
const SITE_ID = `${SITE}/#website`;
const ORG_ID = `${SITE}/#labs`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Halleluyah Oludele",
  alternateName: ["hallelx2", "Oludele Halleluyah"],
  url: SITE,
  jobTitle: "Full-stack and AI engineer",
  description:
    "Full-stack engineer and final-year medical student who builds the products he needed — " +
    "across healthcare, education and the AI layer underneath them.",
  sameAs: [
    "https://github.com/hallelx2",
    "https://x.com/hallelx2",
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Ibadan" },
  address: { "@type": "PostalAddress", addressLocality: "Ibadan", addressCountry: "NG" },
  email: "mailto:halleluyaholudele@gmail.com",
  worksFor: { "@id": ORG_ID },
  /* Only what the site can show you a repository or a page for. */
  knowsAbout: [
    "Go", "TypeScript", "Python", "Java", "Bun", "Next.js", "React Native", "Expo",
    "Cloudflare Workers", "Durable Objects", "PostgreSQL", "Drizzle ORM", "Hono",
    "Spring Boot", "Spring AI", "Model Context Protocol", "Retrieval-augmented generation",
    "Information retrieval", "PDF parsing", "Clinical voice AI",
  ],
} as const;


/* hallelx2 labs as an entity in its own right.
 *
 * It is one person, and the site says "Independent" — so numberOfEmployees is
 * stated rather than left for a reader to assume a company sits behind it, and
 * founder points at the human. No address beyond the city, no registration
 * number, no funding: none of that exists to claim. */
const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "hallelx2 labs",
  url: SITE,
  logo: `${SITE}/assets/img/og-card.png`,
  description:
    "An independent software lab building products across healthcare, education " +
    "and the AI layer underneath them, plus the open-source libraries they run on.",
  founder: { "@id": PERSON_ID },
  numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
  address: { "@type": "PostalAddress", addressLocality: "Ibadan", addressCountry: "NG" },
  sameAs: ["https://github.com/hallelx2", "https://x.com/hallelx2"],
} as const;

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE,
  name: "hallelx2 labs",
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
  author: { "@id": PERSON_ID },
} as const;

/* ── products ────────────────────────────────────────────────────────
   applicationCategory and codeRepository only where both are true. A
   repository is listed when it is public; the four with none simply omit
   the property. */
type App = {
  name: string;
  category: string;
  repo?: string;
  license?: string;
  language?: string;
};

const APPS: Record<string, App> = {
  "/products/voxtar":      { name: "Voxtar", category: "HealthApplication", language: "TypeScript" },
  "/products/aurahealth":  { name: "AuraHealth", category: "HealthApplication", language: "TypeScript" },
  "/products/coursified":  { name: "Coursified", category: "EducationalApplication", language: "TypeScript" },
  "/products/hypatia":     { name: "Hypatia", category: "EducationalApplication", language: "TypeScript" },
  "/products/mb3prepbot":  { name: "MB3 Prepbot", category: "EducationalApplication", language: "Python" },
  "/products/vectorless":  { name: "Vectorless", category: "DeveloperApplication", language: "Go",
                             repo: "https://github.com/hallelx2/vectorless-engine", license: "https://www.apache.org/licenses/LICENSE-2.0" },
  "/projects/notebooklm":  { name: "NotebookLM, self-hosted", category: "DeveloperApplication", language: "TypeScript",
                             license: "https://opensource.org/licenses/MIT" },
  "/projects/bridgehook":  { name: "BridgeHook", category: "DeveloperApplication", language: "TypeScript",
                             repo: "https://github.com/hallelx2/bridgehook", license: "https://opensource.org/licenses/MIT" },
  "/projects/mercala":     { name: "Mercala", category: "BusinessApplication", language: "Java" },
  "/projects/tether":      { name: "Tether", category: "UtilitiesApplication", language: "TypeScript" },
};

/* ── the ten articles published on X ─────────────────────────────────
   Read off x.com/compose/articles on 22 September 2026. datePublished is
   the real publication date; url points at the post, because that is where
   the article actually lives. */
const ARTICLES: Array<{ headline: string; date: string; id: string }> = [
  { headline: "Citation Needs Coordinates — Why I Wrote a PDF Engine in Go", date: "2026-09-18", id: "2101029934906925380" },
  { headline: "What Matters then?", date: "2026-09-11", id: "2098365782266675565" },
  { headline: "Your Admin Workflow Needs an MCP Server, Not Another Dashboard", date: "2026-09-11", id: "2098208606625636827" },
  { headline: "T3 Code Is the Future of Harnesses", date: "2026-09-09", id: "2097666545941983397" },
  { headline: "Sometimes, Cloudflare Is All You Need", date: "2026-09-08", id: "2097401461709676646" },
  { headline: "Mercala — A Store You Run by Talking to It", date: "2026-09-07", id: "2097072971382747609" },
  { headline: "How I Moved a Live Telegram Bot Off AWS in Six Seconds", date: "2026-09-02", id: "2095199915357974598" },
  { headline: "Your Browser Is the Tunnel", date: "2026-08-26", id: "2092678321062707435" },
  { headline: "How I Marketed a Free Study Bot From Inside Its Own Code", date: "2026-08-25", id: "2092230044152209887" },
  { headline: "How I Used Bachs + a Cloudflare Worker to Orchestrate a Payment Gateway in My Telegram Bot", date: "2026-08-25", id: "2092095347489141139" },
];

/** Routes whose body is a substantive technical piece I wrote. */
const TECH_ARTICLE = /^\/stack\/|^\/projects\/|^\/how-i-work$/;

/** Titles carry a " — hallelx2 labs" suffix; a breadcrumb leaf should not. */
const leaf = (title: string) => title.replace(/\s+—\s+hallelx2 labs$/, "");

/* Section indexes that are real pages. /projects deliberately is not one —
   the ten products and projects share /products — so a /projects/<slug>
   breadcrumb must not advertise a URL that 404s. */
const SECTION_PAGES = new Set(["products", "stack", "training"]);

function crumbs(route: string, title: string) {
  const parts = route.split("/").filter(Boolean);
  if (!parts.length) return null;
  const items = [{ "@type": "ListItem", position: 1, name: "hallelx2 labs", item: SITE }];
  let acc = "";
  parts.forEach((p, i) => {
    acc += `/${p}`;
    const isLeaf = i === parts.length - 1;
    if (!isLeaf && !SECTION_PAGES.has(p)) return;   // no page, no crumb
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: isLeaf ? leaf(title) : p.replace(/-/g, " "),
      item: `${SITE}${acc}`,
    });
  });
  return { "@type": "BreadcrumbList", itemListElement: items };
}

/**
 * The graph for one route. Person and WebSite ride along on every page so the
 * same @id is reinforced everywhere rather than stated once and hoped for.
 */
export function graphFor(route: string, title: string, description: string) {
  const url = `${SITE}${route === "/" ? "" : route}`;
  const nodes: Record<string, unknown>[] = [person, organization, website];

  const page: Record<string, unknown> = {
    "@type": route === "/about" ? "ProfilePage" : "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
  };
  const bc = crumbs(route, title);
  if (bc) page.breadcrumb = bc;
  /* Google wants ProfilePage.mainEntity to identify the subject, and being in
     the same @graph is not itself a relationship — the link has to be stated.
     Set after the type-specific nodes below so it can point at them. */
  nodes.push(page);

  const app = APPS[route];
  if (app) {
    nodes.push({
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: app.name,
      description,
      url,
      applicationCategory: app.category,
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
      ...(app.license ? { license: app.license } : {}),
      ...(app.repo ? { isBasedOn: { "@id": `${url}#source` } } : {}),
    });
    /* schema.org puts programmingLanguage and codeRepository on
       SoftwareSourceCode, not SoftwareApplication. Emit the source node only
       where there is a public repository to point it at. */
    if (app.repo) {
      nodes.push({
        "@type": "SoftwareSourceCode",
        "@id": `${url}#source`,
        name: app.name,
        codeRepository: app.repo,
        ...(app.language ? { programmingLanguage: app.language } : {}),
        ...(app.license ? { license: app.license } : {}),
        author: { "@id": PERSON_ID },
      });
    }
  }

  if (route === "/writing") {
    nodes.push({
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: "Writing — hallelx2 labs",
      author: { "@id": PERSON_ID },
      blogPost: ARTICLES.map((a) => ({
        "@type": "BlogPosting",
        headline: a.headline,
        datePublished: a.date,
        url: `https://x.com/hallelx2/status/${a.id}`,
        author: { "@id": PERSON_ID },
      })),
    });
  }

  if (TECH_ARTICLE.test(route)) {
    nodes.push({
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: leaf(title),
      description,
      url,
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
      inLanguage: "en",
    });
  }

  /* mainEntity points at whatever this page is primarily about: the person on
     the profile, the software on a product page, the piece on an article page. */
  if (route === "/about") page.mainEntity = { "@id": PERSON_ID };
  else if (APPS[route]) page.mainEntity = { "@id": `${url}#software` };
  else if (route === "/writing") page.mainEntity = { "@id": `${url}#blog` };
  else if (TECH_ARTICLE.test(route)) page.mainEntity = { "@id": `${url}#article` };

  return { "@context": "https://schema.org", "@graph": nodes };
}
