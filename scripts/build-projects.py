#!/usr/bin/env python3
"""Generate the per-project detail pages into the OpenDesign source.

Every fact here was read out of the repository it describes. Nothing is
estimated. Where a repo documents a gap, the page says so rather than
rounding it up.

    python3 scripts/build-projects.py && node scripts/port.mjs
"""
from pagekit import SRC, arch, sec, does, talk, table, pull, page

# ══ MERCALA ══════════════════════════════════════════════════════════
mercala_arch = arch([
    [("Next.js web", "server-first, bun", "pale")],
    [("mercala-core :8080", "modular monolith", "accent"),
     ("mercala-agent :8082", "spring ai tools", "accent"),
     ("mercala-image-gen :8083", "5 providers", "accent")],
    [("Kafka", "3 topics, outbox", None)],
    [("Postgres / ParadeDB", "bm25 + pgvector + rls", None),
     ("S3 / MinIO", "product imagery", None)],
], "Mercala architecture: a Next.js web app over a modular-monolith core with two carved-out services, joined by Kafka, over ParadeDB and object storage.")

page(
    "project-mercala.html",
    "Mercala &mdash; hallelx2 labs",
    "An agent-native, multi-tenant commerce platform in Java 21 and Spring AI — hybrid search without Elasticsearch, three layers of tenant isolation, and a transactional outbox over Kafka.",
    "mercala", "Commerce &middot; In build", "Mercala",
    "An online store you run by talking to it.",
    [("297", "Java files across four Maven modules, ~26,000 lines"),
     ("388", "tests, and a bypass test that proves tenants cannot read each other"),
     ("0", "Elasticsearch clusters &mdash; the search is Postgres")],
    [
        sec("01", "Why it exists", None,
            '<div class="who" data-reveal><div class="bio"><p>Most of setting up a shop is typing things into boxes. Name, description, SKU, price, each size, a photograph for each colour. <b>Mercala replaces that with a sentence</b>, and asks only when something is missing.</p><p>The same inversion runs on the other side of the counter. Nobody searches for &ldquo;navy linen shirt, regular fit&rdquo; &mdash; they search for the occasion. So the shopper talks too, and the catalogue is read for meaning rather than matched on words.</p><p>It is built Java-first because the thing underneath is a ledger of other people&rsquo;s money and stock, and that is a place where I want types, transactions and a schema somebody else can audit.</p></div></div>'),
        sec("02", "The shape of it", "Four Maven modules: one monolith, two services carved out for extraction, one contracts jar.",
            f'<div class="arch" data-reveal>{mercala_arch}<p class="take">The core is a <b>modular monolith</b> &mdash; nine packages behind one deployable &mdash; because splitting on day one buys distributed transactions before it buys anything else. The agent and the image generator were carved out because they have genuinely different failure and scaling shapes: one waits on a model, the other waits on an image provider for up to three minutes.</p></div>'),
        pull("Adding a provider means adding a class that implements the interface — never adding a branch to an existing one.",
             "CLAUDE.md, on the five image providers"),
        sec("03", "The stack, and what each piece is doing", None,
            does([
                ("Java 21 &middot; Spring Boot 3.3.5", "The core: identity, catalog, cart, order, payment, inventory, media, and a platform package holding multi-tenancy, security, the outbox and idempotency."),
                ("Spring AI", "Tool calling, not chat completion. Three tool beans &mdash; catalogue, imagery, and a human-in-the-loop set that can stop and ask the merchant a question mid-turn."),
                ("ParadeDB &middot; pgvector", "Hybrid search inside Postgres. BM25 for the words, a 1536-dimension vector index for the meaning, fused with reciprocal rank fusion. No second datastore to keep in sync."),
                ("Kafka &middot; transactional outbox", "Three topics. A product change writes its event in the same transaction as the row, and a relay publishes it after commit, so the event and the data cannot disagree."),
                ("Resilience4j", "A circuit breaker per dependency, tuned per dependency &mdash; one image provider&rsquo;s cold start legitimately takes three minutes, and the inherited five-second threshold was opening the circuit on a working backend."),
                ("Terraform &middot; Ansible &middot; OIDC", "Onto an AWS spot instance, with <b>no access keys anywhere</b>: CI assumes a role through GitHub OIDC, the host uses an instance profile."),
            ])),
        sec("04", "Three layers of tenant isolation", "Each one alone is a single point of failure, so there are three.",
            talk("A tenant should not be able to read another tenant&rsquo;s rows even if I write the query wrong.", [
                ("Role checks in code", "Four roles, enforced at the method. This is the layer that fails first when someone adds an endpoint and forgets."),
                ("A Hibernate tenant filter", "A request-scoped tenant context applied as an aspect, so ordinary repository calls are scoped whether or not the caller remembered."),
                ("Row-level security in Postgres", "Thirteen policies across nine migrations. This is the layer that holds when the other two are bypassed &mdash; and there is a test that issues a raw query to prove it."),
                ("The standing rule", "Never weaken one layer without a test proving the others still hold."),
            ])),
        sec("05", "What is counted, and what is not", "The repository&rsquo;s own roadmap is the source for both.",
            table("Read from the repository on 21 September 2026",
                  ["Piece", "Count", "Note"],
                  [["Java files", "297", "212 main, 85 test, ~26,000 lines"],
                   ["Tables", "17", "20 Flyway migrations, schema owned by Flyway"],
                   ["HTTP endpoints", "49", "across 20 controllers"],
                   ["Tests", "388", "including the tenant-bypass test"],
                   ["AG-UI event types", "16", "the agent streams a typed protocol, not raw text"],
                   ["Image providers", "5", "behind one router with a fallback chain"]],
                  "<b>What is not done, stated plainly:</b> payment <i>charging</i> was never wired. The provider adapters and the inbound webhook both exist; the call between them does not, so an order means ordered, not paid. Metrics and tracing are also still open. These are in the repository&rsquo;s roadmap as open items, and they are open here too.")),
    ],
    "The interesting part was not the AI.",
    "It was making a shop that several merchants share impossible to leak across, and making search good enough without a second database to operate.",
)

# ══ TETHER ═══════════════════════════════════════════════════════════
tether_arch = arch([
    [("Expo app", "expo-router, 21 screens", "pale")],
    [("Bun.serve :4000", "hand-written router", "accent")],
    [("Route modules", "7 files, 35 routes", None),
     ("SSE stream", "one per user, replayable", None)],
    [("bun:sqlite", "raw sql, 13 tables", None)],
], "Tether architecture: an Expo app over a dependency-free Bun server with a single SSE stream, on embedded SQLite.")

page(
    "project-tether.html",
    "Tether &mdash; hallelx2 labs",
    "Know where your things are. A Bun backend with zero dependencies, SSE instead of WebSockets, and a compare-and-swap that makes the lost update unexpressible.",
    "tether", "Possessions &middot; Built", "Tether",
    "Know where your things are.",
    [("0", "runtime dependencies in the backend &mdash; not a framework, Bun itself"),
     ("35", "routes and 13 tables behind them"),
     ("1", "statement to claim an item, which is what makes the race unwinnable")],
    [
        sec("01", "Why it exists", None,
            '<div class="who" data-reveal><div class="bio"><p>You lend something out and then it is gone. <b>Nobody stole it</b> &mdash; they just forgot whose it was, or passed it on to someone who never knew.</p><p>So every item gets a scannable tag, and lending is a scan between two phones. If the borrower passes it on, the chain grows and you still see the last hop.</p><p>The interesting problem is not the tags. It is that a physical object can be held by exactly one person, and two phones scanning the same tag at the same moment is the whole game.</p></div></div>'),
        pull("No lock, no transaction, no read-modify-write — the lost update is not expressible.",
             "README, on claiming custody"),
        sec("02", "The one statement that matters", "Two people standing next to each other, both scanning.",
            talk("Custody is claimed with a single conditional update, so there is nothing to race.", [
                ("Compare and swap", "The update sets the new holder only <i>where the holder is still who I thought it was</i>. One row changes or none does, and the code reads the count. There is no window between reading and writing, because there is no read."),
                ("An append-only log", "Current holder, hop count and the full journey are folds over an event log rather than stored counters, so they cannot drift from each other."),
                ("Idempotency as an index", "Double taps and retries are the <i>normal</i> case when somebody is standing in front of you holding a camera, so a replayed scan collides with a unique index instead of being reasoned about."),
                ("A type that forbids the bug", "The helper wrapping a critical section is typed so that an <code>await</code> inside it is a compile error rather than a code-review note."),
            ])),
        sec("03", "The shape of it", "A Bun backend, an Expo app, and one stream between them.",
            f'<div class="arch" data-reveal>{tether_arch}<p class="take">Realtime is <b>server-sent events, not WebSockets</b>, and the reasoning is written down: the traffic is one-directional, and an SSE response is an ordinary HTTP response, so it reuses the same router, the same auth check and the same CORS rules. A socket upgrade bypasses all three. The events carry <b>no row data</b> &mdash; only an id and a reason &mdash; so the client re-fetches through normal authorised endpoints and a bug in the stream cannot leak a row.</p></div>'),
        sec("04", "Zero dependencies, on purpose", "Every line in this table is a library that is not in the project.",
            table("What replaced what",
                  ["Concern", "Usual library", "What is actually used"],
                  [["HTTP server", "Express, Hono, Elysia", "<code>Bun.serve</code> and a ~90-line router"],
                   ["Database", "Prisma, Drizzle", "<code>bun:sqlite</code> and raw SQL"],
                   ["Migrations", "a migration tool", "an array of statements and a table"],
                   ["Password hashing", "bcrypt, argon2", "<code>Bun.password</code>, off the event loop"],
                   ["Google sign-in", "an OAuth client", "JWKS fetched and verified with WebCrypto"],
                   ["Realtime", "socket.io", "SSE with a replay buffer and resume"]],
                  "The point was not minimalism for its own sake. It was that each of those is a small, well-specified problem, and owning them means the failure modes are mine to read rather than mine to guess at.")),
        sec("05", "Honest state", None,
            talk("Built and demonstrated. Not deployed, and not tested the way I would want.", [
                ("No tests", "Verification was screenshotting every screen on a real emulator, which is where all of the real bugs were found &mdash; but it is not a suite, and I will not call it one."),
                ("Runs locally", "There is no Dockerfile and no CI. It runs on a laptop and an emulator, against a SQLite file."),
                ("Deliberately unwired", "SMS, push, NFC writing and printing return <i>not sent</i> rather than pretending, because a fixture that looks delivered is worse than one that admits it is not."),
                ("There is a demo", "Four minutes and forty-four seconds of it, captured on a real device against the real API."),
            ])),
    ],
    "The backend is 3,000 lines and imports nothing.",
    "That was not a constraint I was given. It was a question about how much of a framework I actually needed, answered by not using one.",
)

# ══ NOTEBOOKLM ═══════════════════════════════════════════════════════
nb_arch = arch([
    [("Next.js on Vercel", "hosted", "pale"), ("Electron desktop", "local-first", "pale")],
    [("One Hono app", "same routes, both shells", "accent")],
    [("PlatformAdapter", "db + storage + auth", None)],
    [("Neon Postgres", "hosted", None), ("PGlite", "embedded, offline", None)],
], "Self-hosted NotebookLM architecture: a hosted web app and a desktop app mounting one Hono server, differing only by a platform adapter.")

page(
    "project-notebooklm.html",
    "NotebookLM, self-hosted &mdash; hallelx2 labs",
    "An open-source, local-first NotebookLM: one Hono app served by both a Next.js deployment and an Electron desktop build, with a seven-step retrieval pipeline and a research agent that critiques itself.",
    "notebook", "AI &middot; Open source", "NotebookLM, self-hosted",
    "Most tutorials ship 200 lines that break in front of a real user.",
    [("1", "server, mounted by both a web deployment and a desktop app"),
     ("18", "tables, including five embedding tables &mdash; one per dimension"),
     ("13", "model providers, and your keys never sit in the database in plaintext")],
    [
        sec("01", "Why it exists", None,
            '<div class="who" data-reveal><div class="bio"><p>Every &ldquo;build a NotebookLM clone&rdquo; tutorial ships a demo that falls over the moment a real document and a real user arrive. I wanted <b>the shipped version</b> &mdash; the one with migrations, retries, cancellation and a story for what happens when the model returns nonsense.</p><p>It runs two ways from one codebase: hosted, on Neon and S3; or entirely on your machine, with an embedded Postgres, local files and a local text-to-speech model, so it works with no account and no network.</p></div></div>'),
        sec("02", "One server, two shells", "The only difference between the hosted app and the desktop app is a single adapter.",
            f'<div class="arch" data-reveal>{nb_arch}<p class="take">The whole server is one Hono app. Next.js mounts it under a catch-all route; Electron mounts it through the dev server, then as a bundle. <b>Behaviour is identical because the only thing that differs is the adapter</b> holding the database, the storage and the auth &mdash; Neon or an embedded Postgres, S3 or the local filesystem.</p></div>'),
        sec("03", "How a question is answered", "Seven steps, and two of them can fail without taking the answer down.",
            does([
                ("1 &middot; Expand", "The question is rewritten into a small set of phrasings. If the model errors, the original question is used and nothing is lost."),
                ("2 &middot; Embed and search", "Cosine search against the embedding table matching the model&rsquo;s dimension &mdash; five sibling tables exist so changing embedding model is not destructive."),
                ("3 &middot; Keyword pass", "A case-insensitive match over chunk text, merged with the vector hits. Vector results win collisions."),
                ("4 &middot; Threshold and rerank", "Weak matches are dropped, then the model scores the survivors and the top slice is kept. Both the expansion and the rerank degrade to the unprocessed list rather than failing."),
                ("5 &middot; Answer with markers", "Chunks go into the prompt carrying ids, and citations are streamed as the model echoes them, so a claim is linked to its source as it is written."),
                ("6 &middot; Deep research", "A planner splits the question, searches in parallel, scores and summarises the sources, then writes the report section by section."),
                ("7 &middot; Critique, then verify", "The agent grades its own report. <b>If it finds gaps and rates itself below eight out of ten, it runs a second bounded round</b> and appends what it found, then lists which claims it could actually support."),
            ])),
        pull("Silent fallback on a thrown error is a footgun.",
             "agent/harness.ts, on why one error is deliberately not caught"),
        sec("04", "The parts that are not the demo", None,
            talk("This is the half that tutorials leave out.", [
                ("Keys are encrypted with the user bound in", "Provider keys are never environment variables and never plaintext in the database. They are encrypted with the user id mixed into the encryption itself, so decrypting one user&rsquo;s key as another fails rather than succeeding quietly."),
                ("Changing embedding model is non-destructive", "Five sibling tables, one per dimension, and retrieval only reads rows written by the model currently configured."),
                ("Closing the window does not cancel the work", "If the modal closes mid-generation the job keeps running so the result still lands; cancelling is a separate, explicit path."),
                ("Two-host audio, locally if you want", "The script is generated as speaker turns, then voiced &mdash; hosted, or by a local model with no key and no network. Concurrency differs per backend for a written-down reason."),
                ("Results are cached on content, not counts", "The cache key fingerprints the actual chunks, because chunk ids regenerate on re-ingest and a row count would miss a change."),
            ])),
        sec("05", "Honest state", None,
            '<div class="talk" data-reveal><h3>Shipped, documented, and without a test suite.</h3><ul><li><b>No tests</b>There is typechecking, linting and formatting, and no test files. That is the largest gap in the project and it is not disguised here.</li><li><b>29 releases</b>Versioned and changelogged from 0.1.9 to 0.3.0.</li><li><b>MIT</b>Including a 45-page write-up of how it was built.</li></ul></div>'),
    ],
    "The interesting work was in the failure paths.",
    "Any of these steps can fail. The question that took the time was which ones are allowed to take the answer down with them, and which should quietly hand back what they had.",
)

# ══ BRIDGEHOOK ═══════════════════════════════════════════════════════
# Read from hallelx2/bridgehook on 2026-09-22 (HEAD, last commit 2026-08-25).
# Deliberately understated against the README: verification is claimed there for
# six providers and implemented for three, and the hosted domain does not resolve.
bh_arch = arch([
    [("Stripe / GitHub / Shopify", "the sender, unchanged", "pale")],
    [("Cloudflare Worker", "public /hook/:channel endpoint", "accent")],
    [("Durable Object", "holds the SSE, hibernates idle", "accent"),
     ("Neon Postgres", "every event, request and response", None)],
    [("Your browser tab", "the agent: receive, forward, reply", "accent")],
    [("localhost:3000", "your dev server, untouched", "pale")],
], "BridgeHook architecture: a webhook sender posts to a Cloudflare Worker, which hands the event to a per-channel Durable Object holding an SSE stream to a browser tab, which forwards it to localhost and posts the response back.")

page(
    "project-bridgehook.html",
    "BridgeHook &mdash; hallelx2 labs",
    "Webhook observability with nothing installed: a public URL forwards Stripe or GitHub to your localhost because the browser tab is the tunnel agent, with the stream held in a Cloudflare Durable Object.",
    "bridgehook", "Tooling &middot; Open source", "BridgeHook",
    "The browser tab is the tunnel. There is nothing to install because there is nothing to install.",
    [("0", "binaries to install &mdash; the agent is a webpage holding an SSE stream"),
     ("30s", "CPU limit per Worker request, which is the whole reason for the Durable Object"),
     ("3", "signature schemes actually verified &mdash; Stripe, GitHub and Shopify")],
    [
        sec("01", "The problem it picks at", None,
            '<div class="who" data-reveal><div class="bio"><p>Every webhook tunnel makes you install something &mdash; an <code>ngrok</code> binary, <code>cloudflared</code>, an npm package, an SSH client. That is fine until you are on a locked-down laptop, or demoing in thirty seconds, or teaching somebody who should not have to learn a package manager before they can test a Stripe webhook.</p><p>The observation underneath BridgeHook is that <b>the browser is already a perfectly good tunnel agent</b>. It can hold a stream open, and it is allowed to reach <code>localhost</code> from an HTTPS page &mdash; so the thing you were going to install is a page you already have open.</p></div></div>'),
        sec("02", "How it actually works", "The Durable Object is not a flourish. It is the only reason this runs for nothing.",
            f'<div class="arch" data-reveal>{bh_arch}<p class="take">A Worker has a <b>30-second CPU limit per request</b>, so an SSE stream held in a Worker would simply die. The stream lives in a per-channel Durable Object instead, which holds writers indefinitely and hibernates when idle &mdash; which is what makes leaving a bridge open all day cost nothing. The relay is a dumb pipe: store the event, hold the stream, correlate request with response.</p></div>'),
        sec("03", "The protocol is four calls", "Which is why the browser is not special.",
            does([
                ("Create the channel", "<code>POST /api/channels</code> returns a channel id and a secret. The secret is generated in the browser, SHA-256 hashed, and only the hash is sent."),
                ("Open the stream", "<code>GET /hook/:channelId/events</code> holds an SSE connection open against the Durable Object, authenticated by that hash in constant time."),
                ("Forward it", "The agent <code>fetch()</code>es <code>http://localhost:3000</code> with the path, method, headers and body it was handed."),
                ("Hand the response back", "<code>POST /hook/:channelId/response</code> correlates by id, so the original sender gets your dev server&rsquo;s real answer rather than a fabricated 200."),
            ])),
        pull("We are not the first to relay webhooks over SSE. smee.io has done this since 2017 and inspired a lot of the wire shape here.",
             "the BridgeHook README, on prior art"),
        sec("04", "What it does that a tunnel does not", "The tunnel is the boring half.",
            talk("A tunnel moves bytes. This one keeps them and lets you argue with them.", [
                ("Every event is captured", "Full request and response detail in Neon Postgres &mdash; method, path, headers, body, status and latency &mdash; so the feed is a record rather than a tail."),
                ("Replay, and edit-then-replay", "Re-fire any captured event at localhost, or change the headers, body or method first. Reproducing a webhook bug stops involving the sender entirely."),
                ("Signature verification", "Stripe, GitHub and Shopify are verified against a signing secret you paste once, with constant-time comparison. Slack is detected and shown but not yet verified; Clerk and Linear are in the secrets manager only."),
                ("Mock-response mode", "Answer the sender with a canned response without forwarding at all &mdash; which is what you want when the dev server is not running."),
                ("Copy as cURL", "Turn any captured webhook into a terminal command, which is usually the fastest route into a debugger."),
            ])),
        sec("05", "The security shape", "Worth stating precisely, because &ldquo;a public URL into my laptop&rdquo; deserves it.",
            does([
                ("The secret never leaves the browser", "It is generated client-side and hashed before transmission. The relay stores a hash, compares in constant time, and could not replay your traffic if it wanted to."),
                ("The relay holds no key to your machine", "It can deliver bytes to a tab that holds the channel secret. It cannot run code on your machine, and it cannot reach your machine at all on its own."),
                ("Close the tab and the bridge dies", "There is no daemon left behind and no background process to remember to kill &mdash; which is the flip side of the same design that removed the install."),
            ])),
        sec("06", "Honest state", None,
            '<div class="talk" data-reveal><h3>Built and open, not yet hosted &mdash; and the README is ahead of the code in two places.</h3><ul><li><b>Not deployed</b>Four workspaces are built &mdash; the relay Worker at about 2,500 lines, the React dashboard, a Chrome extension and a Tauri desktop shell &mdash; but <code>bridgehook.dev</code> does not currently resolve. You can run the whole stack yourself; there is no hosted instance to point you at.</li><li><b>One release</b>v0.0.1. The README advertises Homebrew, Scoop and Snap channels for the desktop app; those do not exist yet.</li><li><b>No tests</b>There is CI, linting and typechecking, and no test files anywhere in the repository. That is the largest gap in it.</li><li><b>Six providers claimed, three verified</b>Corrected on this page rather than repeated. The README is being fixed.</li><li><b>Chrome moved the goalposts</b>Since Chrome 142, a public page reaching localhost triggers a one-time Local Network Access prompt &mdash; so the extension, which sits outside the page sandbox, is now the sensible default rather than the tab.</li></ul></div>'),
    ],
    "The install was never load-bearing.",
    "Everything that made a webhook tunnel feel like infrastructure &mdash; the binary, the daemon, the account &mdash; turned out to be removable. What is left is a page, a stream, and a database that remembers what came through.",
)

print("four project pages written")
