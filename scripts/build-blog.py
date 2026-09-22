#!/usr/bin/env python3
"""Generate the writing index from the articles actually published on X.

Read off x.com/hallelx2/articles on 22 September 2026 — titles are the
PUBLISHED ones, which differ from the drafts in the vault ("Sometimes,
Cloudflare Is All You Need", not "Cloudflare Is All You Need"). Reach is
as X reported it that day and is rounded by X, not by me, so it is never
summed into a total that would imply a precision it does not have.

    python3 scripts/build-blog.py && node scripts/port.mjs
"""
from pagekit import sec, page, fig, chain, node

X = "https://x.com/hallelx2/status"

POSTS = [
 dict(slug="2101029934906925380", date="18 September 2026", reach="524",
      title="Citation Needs Coordinates &mdash; Why I Wrote a PDF Engine in Go",
      sub="A pure-Go PDF structure engine, because the retrieval engine above it had to "
          "point at the pixels an answer came from. The ICDAR benchmarks, the metric I had "
          "been reporting wrongly for months, and the negative result I like most.",
      tag="pdfgrab", ver="Go"),
 dict(slug="2098365782266675565", date="11 September 2026", reach="1K",
      title="What Matters then?",
      sub="A claim that will annoy people, earned rather than asserted: choosing a language "
          "or a stack has mostly stopped mattering. Not entirely &mdash; mostly, and in a "
          "specific way worth being precise about.",
      tag="languages", ver="Essay"),
 dict(slug="2098208606625636827", date="11 September 2026", reach="1.5K",
      title="Your Admin Workflow Needs an MCP Server, Not Another Dashboard",
      sub="Opening a dashboard should be occasional. For most solo builders it is constant, "
          "and every time it costs a context switch the real work then has to recover from. "
          "The alternative is a tool surface an agent can drive.",
      tag="MCP", ver="Argument"),
 dict(slug="2097666545941983397", date="9 September 2026", reach="915",
      title="T3 Code Is the Future of Harnesses",
      sub="Most people writing code with AI now have several of these tools, and almost "
          "nobody has asked why they are personally doing the routing between them &mdash; "
          "expressing that knowledge by moving their body between terminal tabs.",
      tag="harnesses", ver="Argument"),
 dict(slug="2097401461709676646", date="8 September 2026", reach="1.7K",
      title="Sometimes, Cloudflare Is All You Need",
      sub="In 2017 some researchers argued that attention is all you need. In software, "
          "attention is the only currency you actually spend &mdash; money you can raise, "
          "time you can borrow, attention you can only divide.",
      tag="Cloudflare", ver="Thesis"),
 dict(slug="2097072971382747609", date="7 September 2026", reach="3.9K",
      title="Mercala &mdash; A Store You Run by Talking to It",
      sub="Every platform is going agentic, ecommerce included &mdash; Shopify shipped an "
          "admin assistant and an MCP server with it. Three months ago I decided to learn "
          "Java, and did it by building the agentic store I had been turning over for a while.",
      tag="Mercala", ver="Java"),
 dict(slug="2095199915357974598", date="2 September 2026", reach="1.1K",
      title="How I Moved a Live Telegram Bot Off AWS in Six Seconds",
      sub="The bot was down for about six seconds. A student answering questions at three in "
          "the morning saw a 78-second gap against her own median of 69. What made that "
          "cheap &mdash; and the firewall rule that cost fifteen minutes.",
      tag="MB3 Prepbot", ver="Migration"),
 dict(slug="2092678321062707435", date="26 August 2026", reach="1.5K",
      title="Your Browser Is the Tunnel",
      sub="How a LangSmith tracing quirk became BridgeHook &mdash; a webhook tunnel on a "
          "Cloudflare Worker, two Durable Objects, a Chrome extension and a Neon database "
          "&mdash; and what Chrome&rsquo;s security rulebook did to the plan.",
      tag="BridgeHook", ver="Build diary"),
 dict(slug="2092230044152209887", date="25 August 2026", reach="1K",
      title="How I Marketed a Free Study Bot From Inside Its Own Code",
      sub="Four dated changes to how it asks for support, what the database says each one was "
          "worth, and the conversion rate I nearly published that was really just two small "
          "numbers standing next to each other.",
      tag="MB3 Prepbot", ver="Numbers"),
 dict(slug="2092095347489141139", date="25 August 2026", reach="2.9K",
      title="How I Used Bachs + a Cloudflare Worker to Orchestrate a Payment Gateway in My Telegram Bot",
      sub="A checkout session dies in an hour and a chat message lives forever. That mismatch "
          "is the whole story: why the gateway moved out of the bot, how the Worker is "
          "secured, and the hole I found in my own design.",
      tag="Bachs", ver="Payments"),
]

def card(p):
    return (f'<a class="sq" href="{X}/{p["slug"]}" target="_blank" rel="noopener">'
            f'<span class="i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            f'<path d="M18 3.2 21 6l-11.7 11.7L5 19l1.3-4.3z"/><path d="M16 5.2 18.8 8"/>'
            f'<path d="M3.5 21.5h17"/></svg></span>'
            f'<b class="nm">{p["title"]}</b>'
            f'<span class="story">{p["sub"]}</span>'
            f'<span class="meta-row"><span class="tag">{p["date"]}</span>'
            f'<span class="ver">{p["reach"]} reads</span>'
            f'<span class="go" aria-hidden="true"><svg><use href="#ax"/></svg></span>'
            f"</span></a>")

page(
    "hallelx2-writing.html", "Writing &mdash; hallelx2 labs",
    "Ten long-form articles published on X — why I wrote a PDF engine in Go, why an MCP server beats an admin dashboard, why choosing a language stopped mattering, T3 Code, and the case for Cloudflare.",
    "writing", "Writing &middot; Published on X", "Writing",
    "Ten pieces I cared enough about to write at length, and publish under my own name.",
    [("10", "articles published on X, the most recent on 18 September 2026"),
     # X truncates: "1K" is 1,000-1,099 and "1.7K" is 1,700-1,799. So the only
     # defensible aggregate is a floor — 522 + 1,000 + 1,500 + 915 + 1,700 —
     # not a point estimate, which would sit BELOW the true minimum.
     ("16,000+", "reads across them, the floor of X&rsquo;s own figures on 22 September 2026"),
     ("0", "of them written to a brief &mdash; each one started as something I had to work out")],
    [
     sec("01", "The arguments", "Each opens on X, where it was published.",
         '<div class="sqs" data-reveal>' + "".join(card(p) for p in POSTS) + "</div>"),
     sec("02", "Why these and not a blog", None,
         '<div class="who" data-reveal><div class="bio">'
         "<p>Each of these started the same way: something I had built forced me to work out an "
         "argument, and the argument turned out to be longer than a post. The pdfgrab piece exists "
         "because a retrieval engine needed to point at pixels and no Go library could do it. The "
         "Cloudflare one because I kept noticing that <b>the bill is not the only thing a service "
         "charges you</b>.</p>"
         "<p>They live on X rather than here because that is where the readers and the argument "
         "actually happen &mdash; the replies are half the point. This page is the index; the "
         "reach numbers are X&rsquo;s own, read on 22 September 2026, and rounded the way X "
         "rounds them.</p>"
         "</div></div>"),
     sec("03", "How they get made", "The same loop as the code, with a different output.",
         fig("From a built thing to a published argument",
             "I do not write to a brief. The thing gets built, and then it owes an explanation.",
             chain([node("build it", "and hit the problem", "on"),
                    node("work out why", "the argument"),
                    node("figures, not screenshots", "drawn in tokens", "on"),
                    node("publish", "under my own name")]),
             "The figures in these articles are built the same way this site is &mdash; HTML and a "
             "token file, rendered to images, rather than screenshots of a diagram tool. That is "
             "why the charts in the pdfgrab piece and the boxes on this site look related: "
             "<b>they come from the same stylesheet</b>.")),
    ],
    "The writing is downstream of the building.",
    "Every one of these came out of a repository on this site. If an argument here interests you, the thing it is about is one click away.",
    back=("hallelx2-landing.html", "hallelx2 labs"),
)
print("writing page written")
