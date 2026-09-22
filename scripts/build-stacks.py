#!/usr/bin/env python3
"""Generate the nine per-stack pages into the OpenDesign source.

One page per square on /stack. Written to be read rather than skimmed — a
claim, a figure that carries it, what the stack actually ran, and the trade
it forced. Every number was read out of the repository named beside it; where
a repo does not publish a number, the page says so instead of estimating one.

    python3 scripts/build-stacks.py && node scripts/port.mjs
"""
from pagekit import arch, sec, does, talk, table, pull, page, fig, chain, node

REPO = "https://github.com/hallelx2"
BACK = ("hallelx2-stack.html", "My stack")

def case(name, href, what):
    """The repo attached as a case study, closing every page."""
    return ('<div class="fig" data-reveal><span class="kicker">The case study</span>'
            f'<h3>{name}</h3><p class="cap">{what}</p>'
            f'<div class="band"><div class="m" style="flex:1 1 100%">'
            f'<a class="cta cta--light" href="{href}" target="_blank" rel="noopener">'
            f'<span class="lbl">Read the source</span>'
            f'<span class="go" aria-hidden="true"><svg><use href="#ax"/></svg></span></a>'
            "</div></div></div>")

# ══ 1 · BUN ══════════════════════════════════════════════════════════
page(
    "stack-bun.html", "Bun &mdash; hallelx2 labs",
    "How Tether&#39;s API runs on Bun with an empty dependency block: Bun.serve, bun:sqlite, argon2id through Bun.password, one compiled executable, and the event-loop-lag metric that makes a synchronous database safe.",
    "stack", "The stack &middot; Bun", "Bun",
    "I wrote a backend with an empty dependency block. The runtime is the framework.",
    [("0", "entries in <code>dependencies</code> &mdash; the whole API is Bun&rsquo;s own surface"),
     ("1", "executable out of <code>bun build --compile</code>, database beside it"),
     ("7", "route modules: auth, devices, lending, preferences, catalogue, search, events")],
    [
     sec("01", "The question it answers", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>Tether&rsquo;s API was not written dependency-free as a stunt. It started as a question I could not answer honestly: <b>how much of a framework do I actually need?</b> Express gives you routing, body parsing, middleware. Bun gives you an HTTP server, a synchronous SQLite driver, and a password hasher &mdash; in the runtime, maintained by the runtime.</p>"
         "<p>So I wrote the router. It is small. And the bet was that a primitive maintained by the people who maintain the runtime ages better than a package maintained by someone who has moved on.</p>"
         "</div></div>"),
     sec("02", "What replaced each package", "Four primitives, and the package each one stands in for.",
         fig("The substitution",
             "Every line of the server is something the runtime already shipped.",
             chain([node("Bun.serve", "HTTP and routing", "on"),
                    node("bun:sqlite", "synchronous, in-process", "on"),
                    node("Bun.password", "argon2id, off the loop", "on"),
                    node("bun build --compile", "one executable", "on")]),
             "The interesting one is <b>bun:sqlite</b>. It is synchronous, which in Node would be a mistake &mdash; a slow query blocks every other request on the event loop. In a single-tenant API where the database is a file on the same disk, a query is measured in microseconds and the synchronous call is <b>faster than the async ceremony around it</b>. But being right on average is not the same as being safe, which is what section 04 is about.")),
     sec("03", "What it commits you to", None,
         does([
           ("You own the router", "No framework means no framework&rsquo;s middleware, no framework&rsquo;s error handling, and no framework&rsquo;s twenty-year history of edge cases. That is the cost, paid once, in code I can read in an afternoon."),
           ("You own the migrations", "Applied at boot and logged by name, so starting the server tells you what changed. There is no migration tool to configure and none to be surprised by."),
           ("You own the metrics", "Nobody instruments your server for you. <code>/metrics</code> reports resident memory, open connections and the number in section 04."),
           ("Deployment is a file copy", "<code>bun build --compile</code> produces an executable. No Node on the host, no <code>node_modules</code> to install, no lockfile to resolve differently in production than it did on my machine."),
         ])),
     sec("04", "The number that makes it safe", "Event-loop lag is the one measurement a synchronous database cannot hide from.",
         fig("The safety net",
             "A synchronous query blocks everyone. So measure the blocking, not the query.",
             chain([node("timer set for 500ms", "the baseline"),
                    node("it fires late", "something held the loop"),
                    node("maxEventLoopLagMs", "served on /metrics", "on")]),
             "A 500ms interval that fires at 512ms means something occupied the thread for 12ms. That is the honest signal: not how fast a query was in isolation, but <b>whether it stopped everybody else</b>. Reading query timings would have told me the happy path was fine; reading loop lag tells me when it was not. The same file also reports open connections, on the principle that a connection you cannot see is a connection you leak.")),
     pull("A connection you cannot see is a connection you leak.",
          "apps/api/src/server.ts, on why /metrics exists at all"),
     sec("05", "What it is not", None,
         talk("Zero dependencies is a bet, not a virtue.", [
           ("It does not scale past one machine", "bun:sqlite is a file. That is the right answer for Tether and the wrong answer the moment two servers need the same rows &mdash; at which point the database changes and most of this page stops applying."),
           ("It is not a general recommendation", "I would not write a multi-tenant billing system this way. The bet pays when the surface is small and the data is one machine&rsquo;s."),
           ("Custody settles on a timer too", "Transfers have a veto window, and it closes on a schedule rather than only when someone reads it &mdash; because a window that only closes when observed is not a window."),
         ])),
     sec("06", "The repository", None,
         case("Tether &mdash; apps/api",
              "/projects/tether",
              "The API is seven route modules over a core of router, auth, atomic custody, ids and events. Read <code>src/server.ts</code> first: it is short, and it names every primitive the rest of the service is built from.")),
    ],
    "The framework I did not install could not break.",
    "That is the whole argument, and it is a narrow one. It holds for a small surface on one machine, and it stops holding the moment either of those changes.",
    back=BACK,
)

# ══ 2 · GO ═══════════════════════════════════════════════════════════
page(
    "stack-go.html", "Go &mdash; hallelx2 labs",
    "Go across the Vectorless retrieval engine, pdfgrab and LLMGate — why a library other people compile into their own programs is a different engineering problem from a service you run yourself.",
    "stack", "The stack &middot; Go", "Go",
    "Three of the things I maintain are Go, and all three are Go for the same reason: somebody else compiles them into their own program.",
    [("49,891", "lines across the retrieval engine, on Go 1.25"),
     ("3", "repositories: the engine, pdfgrab and LLMGate"),
     ("9", "packages in the engine &mdash; parser, tree, retrieval, ingest, storage, cache, queue, db, config")],
    [
     sec("01", "Why Go and not the obvious alternative", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>All three of these are libraries before they are services. Somebody imports pdfgrab into their own binary; somebody runs the engine next to their own application. That changes the engineering problem: <b>a panic in my code is an outage in theirs</b>, and a dependency I pull in becomes a dependency they inherit.</p>"
         "<p>Go is good at exactly that shape &mdash; one static binary, no runtime to install on the host, a standard library big enough that most of these have very few dependencies, and a compiler strict enough to catch the class of mistake that would otherwise reach somebody else&rsquo;s production.</p>"
         "</div></div>"),
     sec("02", "What the engine actually does", "No chunking, and nothing embedded — which is the whole claim.",
         fig("Vectorless, at ingest and at query",
             "A PDF has no headings. Only glyphs with a size and a position.",
             chain([node("parse the stream", "glyphs, lines, rects", "on"),
                    node("rebuild the tree", "real sections, page ranges", "on"),
                    node("persist it", "no chunks, no vectors"),
                    node("an LLM walks it", "opens what it needs", "on"),
                    node("answers with citations", "the section, not the page")]),
             "Vector RAG cuts a document into fragments and searches them by approximate similarity. The fragments have lost the structure that made the document answerable in the first place &mdash; so top-K becomes a guess and you maintain a second database to make the guess. Vectorless rebuilds the hierarchy at ingest and then has <b>an LLM navigate it the way a person flips to the right page</b>: read the table of contents, open the sections that matter, answer from them. Nothing is chunked and nothing is embedded.")),
     sec("03", "The three, and what each one is for",
         "Different problems, one reason for the language.",
         does([
           ("The retrieval engine", "About 49,891 lines on Go 1.25, split across parser, tree, retrieval, ingest, storage, cache and queue, with Connect RPC generated through buf and benchmark commands beside the server."),
           ("pdfgrab", "Walks the PDF content stream and surfaces positioned characters, lines, rects and curves. Tables are found by <b>geometry</b> rather than guessed from text order."),
           ("Coordinates, kept", "Every extracted string keeps the coordinates it came from, so a rasterised page can be drawn with the evidence highlighted in place. That is the part pdfplumber does not give you, and the reason it exists."),
           ("LLMGate", "Anthropic, OpenAI and Gemini behind one client with routing, fallback, cost tracking and composable middleware &mdash; so nothing above it is wired to a single vendor."),
         ])),
     pull("Quality is meaningless without its price.",
          "the vectorless-bench harness, on reporting cost and latency beside recall"),
     sec("04", "On the benchmark, honestly", "The part where I do not have a number to give you.",
         talk("The harness exists. The scores are not in the repository, so they are not on this page.", [
           ("What is measured", "vectorless-bench scores page- and section-grounded recall of the evidence on <b>FinanceBench</b> &mdash; SEC filings whose answers sit in dense financial tables, which is the hard case."),
           ("Against what", "The <code>treewalk</code> retrieval mode against a BM25 lexical floor and the upstream PageIndex library, on equal footing: same model, same hardware, cold cache."),
           ("How it is scored", "Rank-based statistics across tasks rather than a cherry-picked win, and cost and latency reported alongside quality."),
           ("Why there is no number here", "The result set is not published in the repository. I am not going to put a figure on this page that you cannot open the repo and check &mdash; so the method is described and the score is not claimed."),
         ])),
     sec("05", "The repository", None,
         case("vectorless-engine",
              "https://github.com/hallelx2/vectorless-engine",
              "Start at <code>pkg/tree</code> and <code>pkg/retrieval</code> &mdash; the first builds the structure, the second is the agentic loop that walks it. <code>cmd/</code> holds the server and the benchmark commands.")),
    ],
    "The compiler is doing work on somebody else's behalf.",
    "That is the argument for Go here, and it is specific: these are things other people build into their own programs, and strictness at compile time is cheaper than a panic in a stranger's service.",
    back=BACK,
)

# ══ 3 · JAVA / SPRING AI ═════════════════════════════════════════════
page(
    "stack-java.html", "Java 21 and Spring AI &mdash; hallelx2 labs",
    "Mercala on Java 21 and Spring Boot: four Maven modules, defence in depth for multi-tenancy, hybrid search inside Postgres with no Elasticsearch, and Kafka with a transactional outbox.",
    "stack", "The stack &middot; Java 21 &amp; Spring AI", "Java 21 and Spring AI",
    "Mercala is the one built the way a team would need it built, because that is the constraint it was written under.",
    [("4", "Maven modules under one parent, on Java 21"),
     ("3", "layers of tenant isolation, none of them trusted alone"),
     ("0", "Elasticsearch clusters &mdash; hybrid search lives inside Postgres")],
    [
     sec("01", "The shape, and why it is not one service", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>Mercala is a <b>modular monolith with two things carved out of it</b>. <code>mercala-core</code> holds the commerce domain; <code>mercala-agent</code> runs the Spring AI side; <code>mercala-image-gen</code> does product imagery; and <code>mercala-contracts</code> is its own module so the three cannot quietly drift apart.</p>"
         "<p>That last one is the decision worth defending. Contracts as a separate artefact means a change to a shared type breaks the build of everything that depends on it &mdash; <b>at compile time, in CI, rather than at runtime in front of a customer</b>. It is the cheapest possible version of the integration test I would otherwise have to write.</p>"
         "</div></div>"),
     sec("02", "Multi-tenancy, three layers deep", "Never weaken a layer without a test proving the others still hold.",
         fig("Defence in depth",
             "One tenant reading another tenant's rows has to get through three different mechanisms.",
             chain([node("RBAC", "is this role allowed", "on"),
                    node("Hibernate filter", "scoped at the ORM", "on"),
                    node("Postgres RLS", "enforced in the database", "on")]),
             "Shared database with a <code>tenant_id</code> is the cheap topology and the dangerous one, because a single missing <code>WHERE</code> leaks everything. So the isolation is asserted three times: role-based access at the edge, a Hibernate tenant filter on every query the ORM builds, and <b>row-level security in Postgres itself</b>, which holds even if the application is wrong. The rule in the repo is explicit &mdash; never weaken a layer without a test proving the others still hold.",
             [("3", "independent layers"), ("1", "shared database"), ("RLS", "the backstop that survives an application bug")])),
     sec("03", "What Spring is actually carrying", "Each one is there for a named failure.",
         does([
           ("Spring Kafka, with an outbox", "Messages cross process boundaries through a <b>transactional outbox</b> with idempotent consumers and a dead-letter queue &mdash; so a message is never published for a transaction that rolled back, and a redelivery is not a second order."),
           ("Spring events in-process", "Inside the monolith the same decoupling is a Spring event, with no broker in the path. Kafka is for process boundaries, not for fashion."),
           ("Resilience4j", "Circuit breaking and retry around the calls that leave the process &mdash; payments, models, storage."),
           ("Spring AI", "The agent module talks to an OpenAI-compatible API, so the provider is swappable. It currently runs GLM-4.7 behind nginx, which is the point: none of the code knows."),
           ("Actuator and structured logs", "Health and metrics from Actuator, logs through logstash-logback-encoder so they come out structured rather than needing to be parsed later."),
           ("springdoc", "The OpenAPI surface is generated from the controllers, so the documented API and the real one cannot disagree."),
         ])),
     sec("04", "Search, without the second cluster", "The decision I would defend hardest on this project.",
         fig("Hybrid retrieval inside Postgres",
             "Two rankings, fused — and one database to run, back up and reason about.",
             chain([node("pg_search BM25", "lexical, ParadeDB", "on"),
                    node("pgvector", "semantic neighbours", "on"),
                    node("RRF", "reciprocal rank fusion", "on"),
                    node("one result set", "one datastore")]),
             "Lexical search finds the exact model number; vector search finds &ldquo;something for a christening&rdquo;. You want both, and the usual answer is Elasticsearch beside Postgres &mdash; a second cluster to run, secure, back up and keep in sync, with its own failure modes and its own staleness. ParadeDB puts BM25 <b>inside Postgres</b>, pgvector is already there, and reciprocal rank fusion combines the two rankings without needing them to share a scale. Embeddings come from a local ONNX model, zero-padded to 1536 dimensions so the column does not change when the model does.",
             [("BM25", "exact terms"), ("pgvector", "meaning"), ("RRF", "fused without a shared scale")])),
     pull("There are no AWS access keys, anywhere. Do not reintroduce them.",
          "mercala/CLAUDE.md, on how the deployment authenticates"),
     sec("05", "Deployment, and the keys that do not exist",
         "The instruction in the repo is written in the imperative for a reason.",
         does([
           ("CI to AWS is OIDC", "GitHub Actions assumes a role through OpenID Connect, with a trust condition scoped to <code>repo:hallelx2/mercala:ref:refs/heads/main</code>. The only thing stored in GitHub is a role ARN, which is not a secret."),
           ("Host to AWS is an instance profile", "The host resolves credentials from instance metadata. Nothing is injected into a container and nothing expires into an outage at three in the morning."),
           ("Terraform and Ansible", "Infrastructure is Terraform with remote S3 state; configuration is Ansible. The bootstrap that creates the OIDC provider runs once, locally, and its state is gitignored."),
           ("Honest state", "The payment path is modelled through a <code>PaymentProvider</code> strategy for Stripe, Paystack and Flutterwave &mdash; and it is <b>not wired</b>. That is on the Mercala page in those words too."),
         ])),
     sec("06", "The repository", None,
         case("mercala",
              "/projects/mercala",
              "Read <code>CLAUDE.md</code> first &mdash; it is the architecture document, and it is blunt about which packages are real (<code>com.mercala.order</code>, singular) and which are empty scaffolding awaiting deletion.")),
    ],
    "Spring earns its weight when the constraints are a team's constraints.",
    "Multi-tenancy, money, a message bus and an audit trail are where a framework with twenty years of answers costs less than writing your own — which is the opposite of the argument on the Bun page, and both are true.",
    back=BACK,
)
print("go + java pages written")

# ══ 4 · NEXT.JS ══════════════════════════════════════════════════════
page(
    "stack-next.html", "Next.js &mdash; hallelx2 labs",
    "Next.js App Router across this site, Coursified and Voxtar — server-first by default, one deliberate multi-page heresy, and the two hydration mismatches that came out of porting a static design set.",
    "stack", "The stack &middot; Next.js", "Next.js",
    "Server-first by default, and one deliberate heresy on this particular site.",
    [("3", "web apps: this site, Coursified and Voxtar"),
     ("2", "React #418 hydration mismatches, both found by measurement"),
     ("0", "client-side route transitions here &mdash; on purpose")],
    [
     sec("01", "The default, and when I leave it", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>Server components are the starting point and a client component is a decision. The question I ask is not &ldquo;does this need interactivity&rdquo; but <b>&ldquo;does this need state that outlives a render&rdquo;</b> &mdash; because a surprising amount of what looks interactive is a link, a form, or a details element that the platform already handles.</p>"
         "<p>This site takes that further than most, and the reason is worth explaining rather than defending.</p>"
         "</div></div>"),
     sec("02", "Why this site is a multi-page app on purpose",
         "Every internal link is a plain anchor, and the lint rule that forbids it is disabled with the reason beside it.",
         fig("The heresy",
             "These pages are ported from a static design set, and each one owns its own CSS and its own script.",
             chain([node("a plain <a>", "full document load", "on"),
                    node("the new page's CSS", "nothing leaks in"),
                    node("the new page's script", "runs, every time", "on")]),
             "A client-side transition keeps the document alive. That is normally the point &mdash; but here it means <b>page A&rsquo;s stylesheet is still attached when page B renders</b>, and page B&rsquo;s script, which ran once on first load, does not run again. The design set assumes a fresh document per page. So internal links are plain anchors, the router is the browser, and <code>@next/next/no-html-link-for-pages</code> is switched off in <code>eslint.config.mjs</code> with that paragraph written next to it. A disabled rule with no reason is technical debt; a disabled rule with a reason is a decision.")),
     sec("03", "Two hydration mismatches, and what each taught", "Both were React #418. They had nothing in common.",
         does([
           ("Scripts that ran too early", "Page scripts mutated the DOM before React hydrated, so React found markup it had not rendered and threw it away. Fixed by moving them to <code>next/script</code> with <code>afterInteractive</code> &mdash; the script now runs after hydration rather than racing it."),
           ("Whitespace inside tables", "Whitespace text nodes between <code>&lt;tr&gt;</code> and <code>&lt;td&gt;</code> are <b>relocated by the HTML parser</b>, because a table's content model does not allow them there. React rendered them in one place and found them in another."),
           ("The fix was in the porter", "A <code>NO_WS_CHILDREN</code> set in <code>scripts/port.mjs</code> strips whitespace-only text nodes inside table, thead, tbody, tfoot, tr, colgroup, select and optgroup as they are emitted."),
           ("Why it had to be the porter", "Fixing the output by hand would have lasted until the next re-port. The bug lived in the generator, so the fix did too."),
         ])),
     pull("A disabled lint rule with no reason is technical debt. With a reason, it is a decision.",
          "eslint.config.mjs, on the two rules this repo switches off"),
     sec("04", "Ported, not hand-written", "The design set is the source of truth; the React is output.",
         fig("The pipeline",
             "A design revision re-ports. It is never re-typed.",
             chain([node("OpenDesign v10", "the static HTML set", "on"),
                    node("scripts/port.mjs", "htmlparser2 to JSX", "on"),
                    node("src/module/site/views", "generated, never edited"),
                    node("pixel diff", "against the original", "on")]),
             "Twenty-one pages are generated by one script. Nothing in <code>views/</code> is hand-edited &mdash; every file carries a header saying so &mdash; because the moment you edit output, the generator stops being the source of truth and the next revision costs a day instead of a command. Fidelity is checked by <b>pixel-diffing every page against the original</b> under forced reduced motion, at three widths, rather than by looking at it.")),
     sec("05", "The repository", None,
         case("hallelx2.com",
              "https://github.com/hallelx2/hallelx2.com",
              "<code>scripts/port.mjs</code> is the interesting file: an htmlparser2 walk with a JSX emitter, including the style-object camel-casing and the whitespace rules above. This page was built by it.")),
    ],
    "The framework's defaults are good. The reasons to leave them should be written down.",
    "Two lint rules are off in this repo and both have a paragraph next to them. That is the standard — not that the defaults are always right, but that departing from them is argued rather than assumed.",
    back=BACK,
)

# ══ 5 · EXPO ═════════════════════════════════════════════════════════
page(
    "stack-expo.html", "Expo and React Native &mdash; hallelx2 labs",
    "Two Expo apps — Tether and Coursified — on React 19 and React Native 0.86, both reading one shared design-token package so the phone and the web stay the same product.",
    "stack", "The stack &middot; Expo", "Expo and React Native",
    "Two mobile apps, and neither of them owns a colour.",
    [("2", "Expo apps, each beside the API it talks to"),
     ("1", "token package per product, read by every platform"),
     ("0.86", "React Native, pinned at the workspace root with React 19")],
    [
     sec("01", "Why the tokens live outside the app", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>The failure mode with a product on web and mobile is not that they look different on day one. It is that they <b>drift</b> &mdash; a colour is nudged on the web, the phone keeps the old one, and six months later nobody can say which is correct because both are written down in two places.</p>"
         "<p>So the tokens are a workspace package. <code>@tether/design</code> for one, <code>packages/tokens</code> for Coursified, which serves web and mobile at once. A colour or a type step is declared once and imported everywhere, and <b>there is no second place to change it</b>.</p>"
         "</div></div>"),
     sec("02", "One version of React, enforced at the root",
         "Two copies of React in a native tree is a class of bug you cannot debug from the symptom.",
         fig("The pin",
             "Overrides at the workspace root, not hopeful ranges in each app.",
             chain([node("root package.json", "overrides", "on"),
                    node("react 19.2.3", "exactly"),
                    node("react-native 0.86.3", "exactly"),
                    node("safe-area-context, svg", "pinned too", "on")]),
             "Tether&rsquo;s root <code>package.json</code> pins React, React DOM, React Native, <code>react-native-safe-area-context</code> and <code>react-native-svg</code> by exact version in <code>overrides</code>. In a workspace, two packages asking for compatible-but-different versions is normal resolution behaviour &mdash; and in a native tree it produces <b>hooks that fail across a boundary for no visible reason</b>. The pin is not caution; it is the difference between a build that works and a day lost to a symptom with no stack trace.")),
     sec("03", "What porting a design to native actually costs", "Measurement, not eyeballing.",
         does([
           ("Fonts fall back silently", "A face that is not registered does not error &mdash; it renders in the system font and looks almost right. The only way to know is to check, per platform."),
           ("Shadows are not portable", "iOS shadow properties do nothing on Android, which wants elevation. A card that reads correctly on one looks flat on the other."),
           ("Safe-area insets move everything", "The inset differs by device and by orientation, so a layout verified on one simulator is not verified."),
           ("The token package is the fix", "None of the above is solved by being careful. It is solved by having one declaration site and checking the rendered result against it."),
         ])),
     pull("A design that survives the trip into React Native survives it because somebody measured, not because somebody was careful.",
          "the working rule behind both apps"),
     sec("04", "The repository", None,
         case("Tether &mdash; apps/mobile and packages/design",
              "/projects/tether",
              "The mobile app and the token package sit in the same Bun workspace as the API, so a change to a shared type breaks all three builds at once rather than one of them at runtime.")),
    ],
    "The phone and the web look like the same product because there is one place to change.",
    "That is the whole trick, and it is organisational rather than technical: the token package removes the option of two answers.",
    back=BACK,
)
print("next + expo pages written")

# ══ 6 · CLOUDFLARE ═══════════════════════════════════════════════════
page(
    "stack-cloudflare.html", "Cloudflare Workers and Durable Objects &mdash; hallelx2 labs",
    "BridgeHook's relay on Cloudflare: why the SSE stream lives in a per-channel Durable Object rather than a Worker, what hibernation buys, and where the free tier stops being free.",
    "stack", "The stack &middot; Cloudflare", "Cloudflare Workers",
    "A Worker cannot hold a stream open. A Durable Object can — and that single fact is the product.",
    [("30s", "CPU limit per Worker request, which is the constraint everything follows from"),
     ("1", "Durable Object per channel, hibernating when idle"),
     ("4", "surfaces on one platform: Workers, Durable Objects, Pages and the edge in front")],
    [
     sec("01", "The constraint that designs the system", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>BridgeHook forwards a webhook from the public internet to your <code>localhost</code> by holding a Server-Sent Events stream open to a browser tab. The stream is the product &mdash; and <b>a Worker has a 30-second CPU limit per request</b>, so an SSE connection held in a Worker dies.</p>"
         "<p>Durable Objects are the answer, and not as a workaround. A Durable Object is a single addressable instance with its own state that can hold connections indefinitely and <b>hibernate when nothing is happening</b>. One per channel, woken by an incoming webhook, asleep the rest of the day.</p>"
         "</div></div>"),
     sec("02", "Where each piece sits", "The relay is a dumb pipe, and that is a security property.",
         fig("The path a webhook takes",
             "Hibernation is what makes leaving a bridge open all day cost nothing.",
             chain([node("Stripe posts", "the public URL"),
                    node("Worker", "routes it", "on"),
                    node("Durable Object", "holds the SSE", "on"),
                    node("browser tab", "fetch() localhost"),
                    node("your dev server", "answers")]),
             "The Worker is stateless and finishes in milliseconds. The Durable Object holds the long-lived connection and sleeps between events. Neon Postgres stores every request and response, which is what turns a tunnel into an observability layer. The relay <b>has no key to your machine</b> &mdash; it can only deliver bytes to a tab holding the channel secret, and the secret was generated in your browser, hashed with SHA-256 before it was ever sent, and is compared in constant time.",
             [("30s", "the limit that rules out a Worker"), ("&infin;", "how long a Durable Object may hold a stream"), ("0", "keys the relay holds to your machine")])),
     sec("03", "What the platform is actually good at", "Named honestly, including where it is not the answer.",
         does([
           ("Stateful edge, which is rare", "Durable Objects give you a single-instance, consistent, addressable actor at the edge. Most edge platforms give you stateless functions and tell you to go elsewhere for coordination."),
           ("Hibernation changes the economics", "A connection that costs nothing while idle is what makes &ldquo;leave it open all day&rdquo; a reasonable thing to offer for free."),
           ("Pages for the static half", "The dashboard and the docs site are static builds on Pages. There is no server to run for the part that does not need one."),
           ("Where I would not use it", "Anything wanting a long-running process, a big dependency tree, or a normal Postgres connection pool. The runtime is not Node, and pretending otherwise is how people end up fighting it."),
         ])),
     sec("04", "The thesis, and what I can actually claim",
         "You asked me to reference the &ldquo;Cloudflare is all you need&rdquo; piece. I could not find it.",
         talk("I searched for the article and it is not in anything I can reach, so nothing here quotes it.", [
           ("Where I looked", "<code>~/dev</code> and this repo, every markdown file in them, the GitHub repositories and gists. The four article repositories on disk are <b>bachs</b>, <b>language</b>, <b>mcp</b> and <b>t3code</b> &mdash; each one blog assets and figures, with no Cloudflare piece among them."),
           ("What this page is instead", "Built from the code: BridgeHook&rsquo;s relay, its <code>wrangler.toml</code>, and the Durable Object that holds the stream. Everything above is checkable against the repository."),
           ("What I would add", "Send me the link and the argument goes in properly, quoted and attributed. Writing the thesis for you from memory would be putting words in your mouth on your own portfolio."),
         ])),
     pull("Close the tab and the bridge dies. There is no daemon left behind.",
          "BridgeHook, on the flip side of removing the install"),
     sec("05", "The repository", None,
         case("bridgehook &mdash; relay/",
              "/projects/bridgehook",
              "<code>relay/src/channel-do.ts</code> is the Durable Object and it is about a hundred lines. <code>relay/src/index.ts</code> is the Worker. Note the repo ships no tests and the hosted domain does not currently resolve &mdash; both stated on the project page.")),
    ],
    "The constraint came first, and the architecture followed from it.",
    "That is the honest order. I did not choose Durable Objects and find a use; I hit a 30-second ceiling and there was exactly one thing on the platform that could hold a connection past it.",
    back=BACK,
)

# ══ 7 · PYTHON ═══════════════════════════════════════════════════════
page(
    "stack-python.html", "Python &mdash; hallelx2 labs",
    "Python where the work is numbers, models or a script that has to be readable a year later — MB3 Prepbot serving real students, pyzheimer inside Voxtar, and two packages on PyPI.",
    "stack", "The stack &middot; Python", "Python",
    "Python where the work is numbers, a model, or a script somebody has to read a year from now.",
    [("938", "questions honestly drillable in MB3 Prepbot &mdash; not the 2,864 elsewhere in the repo"),
     ("4,420", "individually markable limbs, which is 442 days at ten a day"),
     ("2", "packages on PyPI: context8 and swarmtorch")],
    [
     sec("01", "The number I had to argue with myself about", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>MB3 Prepbot drills medical students for MB BS Part III. The archive behind it holds <b>6,828 records</b>, of which 3,939 are multiple-choice. An internal status file put the usable question count at 2,864.</p>"
         "<p>The real number is <b>938</b>. A question is only drillable if it has a full answer key, because a limb that cannot be auto-marked cannot be marked at all &mdash; <code>build_pool.py</code> drops it. 2,761 questions have no key whatsoever and 240 are partially keyed. The README says so in those words, correcting its own status file.</p>"
         "</div></div>"),
     sec("02", "What survives the filter", "Every drop is a question a student would otherwise have been marked wrongly on.",
         fig("From archive to drillable",
             "938 is the honest number, not the 2,864 in the status file.",
             chain([node("6,828 records", "the archive"),
                    node("3,939 MCQs", "of those"),
                    node("2,761 dropped", "no answer key at all", "off"),
                    node("240 dropped", "partially keyed", "off"),
                    node("938 drillable", "fully keyed", "on")]),
             "The temptation is to count the archive, because it is the bigger number and it is true in a narrow sense. But a question with no key produces a drill that cannot be marked, and a drill that cannot be marked is worse than no drill &mdash; it teaches a student something unverified. So the pool is the fully-keyed subset. That is <b>4,420 individually markable limbs</b>, or 442 days at ten a day, which is the full year-out runway the bot is actually for.",
             [("6,828", "records in the archive"), ("938", "fully keyed and drillable"), ("4,420", "markable limbs")])),
     sec("03", "How it serves", "A drill that marks itself, every morning.",
         does([
           ("A quiz poll each morning", "Posted to Telegram, marked automatically, with a leaderboard at close of play. Solo spaced repetition is a solved problem; doing it alone at six in the morning is not."),
           ("Negative marking is &minus;0.5", "Because that is what the exam uses. A practice tool that scores differently from the real paper is training the wrong instinct."),
           ("Picture stations", "596 of them &mdash; 240 Paediatrics, 356 O&amp;G &mdash; as photo cards, because a chunk of the exam is recognising an image."),
           ("Answer keys, earned back", "Where the strongest students consistently agree against the recorded key, that is signal. It is how the 2,761 unkeyed questions can be recovered without inventing answers."),
         ])),
     pull("The 938 is the honest number, not the 2,864 in QUESTION-BANK-STATUS.md.",
          "mb3prepbot/README.md, correcting its own status file"),
     sec("04", "The rest of the Python", None,
         does([
           ("pyzheimer", "The analysis service inside Voxtar: recorded speech in, acoustic measures out, compared against <b>that person&rsquo;s own baseline</b> rather than a population average &mdash; which is the only comparison that means anything for a voice."),
           ("context8", "Reached 1.0.0 on PyPI in 18 days across 52 commits."),
           ("swarmtorch", "120 metaheuristic optimisation algorithms brought to PyTorch, with GPU-batched fitness evaluation."),
           ("Why Python for these", "Numerical work, a model in the loop, or a script that has to still be legible when I come back to it after six months on something else."),
         ])),
     sec("05", "The repository", None,
         case("mb3prepbot",
              "https://github.com/hallelx2/mb3prepbot",
              "The README is the document to read &mdash; it opens by correcting its own status file, which tells you more about how the project is run than the code would.")),
    ],
    "The smaller number was the one worth publishing.",
    "Nothing else on this page matters as much as that. A question bank counted generously is a question bank that marks a student wrongly, and the student has an exam.",
    back=BACK,
)
print("cloudflare + python pages written")

# ══ 8 · POSTGRES, DRIZZLE AND HONO ═══════════════════════════════════
page(
    "stack-postgres.html", "Postgres, Drizzle and Hono &mdash; hallelx2 labs",
    "The data and API layer: Drizzle over Postgres on Neon and Supabase, SQLite where the data belongs to one device, Hono as the server that runs in every runtime, and how the monorepos are laid out.",
    "stack", "The stack &middot; Data and the API layer", "Postgres, Drizzle and Hono",
    "One schema, typed end to end — and a server that does not care which runtime it lands in.",
    [("1", "Hono app in the NotebookLM build, mounted by both the web and the desktop shell"),
     ("18", "tables there, five of them embedding tables &mdash; one per dimension"),
     ("2", "databases by design: Postgres where data is shared, SQLite where it is one device&rsquo;s")],
    [
     sec("01", "Why Hono, and why it keeps coming up", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>Hono is a small router built on Web standard <code>Request</code> and <code>Response</code>, which means the same app object runs on Cloudflare Workers, on Bun, on Node and inside an Electron process without being rewritten. That is not a convenience &mdash; it is <b>what lets one server be mounted by two completely different shells</b>.</p>"
         "<p>The self-hosted NotebookLM is the clearest case: a Next.js deployment mounts the Hono app under a catch-all route, and the Electron desktop build mounts the same app through its dev server and then as a bundle. Same routes, same handlers, same behaviour.</p>"
         "</div></div>"),
     sec("02", "One server, two shells, one adapter", "The only thing that differs is where the data lives.",
         fig("The platform adapter",
             "Hosted or entirely local, from one codebase.",
             chain([node("Next.js on Vercel", "hosted"),
                    node("Electron", "local-first"),
                    node("one Hono app", "same routes, both", "on"),
                    node("PlatformAdapter", "db, storage, auth", "on"),
                    node("Neon or PGlite", "hosted or embedded")]),
             "Behaviour is identical because the <b>only</b> thing that differs is an adapter holding the database, the storage and the auth &mdash; Neon and S3 on the hosted side, an embedded Postgres and the local filesystem on the desktop. That is why the desktop build works with no account and no network: nothing above the adapter knows which one it got.")),
     sec("03", "Drizzle, and what it is actually for", "A schema you can read, and types that come from it.",
         does([
           ("The schema is TypeScript", "Tables are declared in code, so the types the application uses are <b>derived from the schema</b> rather than written twice and kept in sync by hand."),
           ("Migrations are files you can read", "Generated as SQL, reviewed in the pull request like anything else. An ORM that hides the migration is an ORM that surprises you during a deploy."),
           ("It stays close to SQL", "Queries look like the SQL they become, which matters the moment one is slow — you can read the query and the plan without translating between two mental models."),
           ("Five embedding tables, on purpose", "One per vector dimension, so changing embedding model is <b>non-destructive</b>: retrieval reads only rows written by the model currently configured, and the old rows stay put."),
         ])),
     sec("04", "When it is not Postgres", "The other answer, and the line between them.",
         fig("Shared versus single-device",
             "The question is not scale. It is how many machines need the same row.",
             chain([node("many clients, one truth", "Postgres + Drizzle", "on"),
                    node("one device's own data", "SQLite", "on")]),
             "Tether&rsquo;s API uses <code>bun:sqlite</code> with no ORM at all, because its data belongs to one machine and a file is the correct shape for that. Mercala uses Postgres with row-level security because many tenants share one database and the isolation has to be enforced below the application. <b>Neither is a compromise</b> &mdash; they are answers to different questions, and using the wrong one shows up as either needless operational weight or a data race you cannot fix in the application layer.")),
     pull("An ORM that hides the migration is an ORM that surprises you during a deploy.",
          "the working rule across these repos"),
     sec("05", "How the monorepos are laid out", "Same shape every time, so moving between them costs nothing.",
         does([
           ("apps/ and packages/", "Deployables in <code>apps/</code>, shared code in <code>packages/</code>. Coursified runs five apps — web, mobile, server, relay, fetcher — over thirteen packages."),
           ("Contracts get their own package", "Schemas, types and the API client are a package every app imports, so a breaking change breaks the build rather than a request."),
           ("Tokens get their own package", "Same reasoning, applied to design. One declaration site for colour and type, read by web and mobile alike."),
           ("Versions pinned at the root", "Anything that must be a single copy — React, a CodeMirror package, React Native — is pinned in root <code>overrides</code>, not hoped for."),
         ])),
     sec("06", "The repository", None,
         case("Self-hosted NotebookLM",
              "/projects/notebooklm",
              "One Hono app, eighteen tables through Drizzle, and a platform adapter that lets the same server run hosted or entirely on your machine.")),
    ],
    "Typed from the schema outward, and portable by default.",
    "Drizzle means the types come from the tables rather than beside them; Hono means the server is not married to the runtime it happens to start in.",
    back=BACK,
)

# ══ 9 · AGENTS, MCP AND THE DESIGN LOOP ══════════════════════════════
page(
    "stack-agents.html", "Agents, MCP and the design loop &mdash; hallelx2 labs",
    "How AI sits inside the work: models behind a gateway rather than one vendor, MCP servers I write rather than only consume, standing skills instead of prompts, and why the OpenDesign flow beats the Claude Design one for this site.",
    "stack", "The stack &middot; Agents and the loop", "Agents, MCP and the design loop",
    "I let an agent do the work. I do not let it decide whether the work is done.",
    [("3", "model providers behind one gateway, switchable by configuration"),
     ("2", "MCP servers written rather than consumed &mdash; vectorless-mcp and Coursified&rsquo;s own"),
     ("0", "merges on a red build &mdash; the gate is machinery, not judgement")],
    [
     sec("01", "Never one provider", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>LLMGate exists so that Anthropic, OpenAI and Gemini are a <b>routing decision with a cost attached</b> rather than three rewrites. Fallback is configuration. Mercala goes further and talks to an OpenAI-compatible API, currently GLM-4.7 behind nginx &mdash; none of the application code knows or cares.</p>"
         "<p>The reason is not vendor politics. It is that model quality, price and availability all move, and a system wired to one provider cannot respond to any of them without a refactor.</p>"
         "</div></div>"),
     sec("02", "Where the AI sits in the loop", "Inside it, with a gate in front — not beside it.",
         fig("The gate",
             "An agent saying it finished is not evidence that it did.",
             chain([node("standing skills", "loaded before it starts", "on"),
                    node("the agent works", "repo-scoped, specified"),
                    node("build, lint, tests", "the real build", "on"),
                    node("automated review", "gates the merge", "on"),
                    node("merge with evidence", "what was measured, when")]),
             "The loop is written down as <b>skills the agent loads before it starts</b>, so the same steps run whether I am watching or not. Fully specified, repo-scoped work is delegated; anything cross-cutting, architectural or ambiguous stays with me. What decides whether something merges is machinery &mdash; the project&rsquo;s real build, not a typecheck standing in for one.")),
     sec("03", "Writing the servers, not just calling them", None,
         does([
           ("vectorless-mcp", "Gives any MCP client structure-preserving retrieval. Consuming somebody else&rsquo;s tool is the easy half of MCP."),
           ("Coursified's own", "<code>packages/mcp</code> inside the monorepo, exposing that product&rsquo;s surface to an agent."),
           ("Skills over prompts", "A prompt is advice. A skill is a procedure that loads every time, which is the difference between a habit and an intention."),
           ("Re-measure before asserting", "Anything claiming a system lacks a feature is checked live before it is repeated &mdash; a cached answer about someone else&rsquo;s API is the fastest thing on the shelf to go stale."),
         ])),
     sec("04", "OpenDesign against Claude Design", "Both produce a design. Only one of them re-ports.",
         fig("Why this site uses OpenDesign",
             "The design set is a source file, so a revision is a command rather than a day.",
             chain([node("OpenDesign v10", "static HTML, in the repo", "on"),
                    node("one porter script", "to React", "on"),
                    node("pixel diff", "against the original", "on"),
                    node("re-port on revision", "not re-type", "on")]),
             "Claude Design is excellent at getting to a good-looking artefact quickly, and for a one-off page that is the right tool. This site is not a one-off page &mdash; it is twenty-one of them sharing one nav, one footer and one token file, revised repeatedly. What OpenDesign gives me is a <b>design set that lives as files I own</b>: a single <code>:root</code>, one <code>@font-face</code> block, a documented contract, and therefore something a script can consume deterministically. The win is not the first render. It is the fifth revision, where the change is re-running the porter and diffing, instead of hand-carrying edits into twenty-one components.",
             [("21", "pages from one script"), ("1", "declaration site for tokens"), ("0", "hand-edited generated files")])),
     pull("A plan that lives only in a chat window does not exist.",
          "the first of the standing rules"),
     sec("05", "The rules that do not bend", None,
         talk("Five of them, and they fire before anything else.", [
           ("Issue first", "Every change starts as a written issue with acceptance criteria. Findings surfaced mid-task become tracked issues immediately rather than staying in the conversation."),
           ("One worktree per issue", "The main checkout stays clean and on main. Parallel work never collides and nothing is committed straight to the default branch."),
           ("Built fully, never stubbed", "No placeholder ships as though it were the real thing. A shortcut forced by a hard constraint is called out and reverted, not left in."),
           ("Verified by measurement", "The real build, lint and tests. &ldquo;Should be fine&rdquo; is not a result, and neither is an agent&rsquo;s report of success."),
           ("Never assert absence from a snapshot", "Before saying a feature does not exist &mdash; and always before asking another person for anything &mdash; re-measure it live."),
         ])),
     sec("06", "This site is the worked example", None,
         case("hallelx2.com",
              "https://github.com/hallelx2/hallelx2.com",
              "Ported by a script, verified by pixel-diffing every page against the design set, and deployed from the same loop. The activity page is generated from the registries for the same reason &mdash; so it cannot flatter me and cannot go quietly out of date.")),
    ],
    "The agent is fast. The gate is what makes the speed worth anything.",
    "Every claim on this site can be checked against a repository, and that is not a coincidence — it is the only version of moving quickly that survives somebody looking closely.",
    back=BACK,
)
print("all nine stack pages written")
