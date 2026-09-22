#!/usr/bin/env python3
"""Shared page furniture for the generators that write into the OpenDesign source.

build-projects.py and build-stacks.py both emit pages in the same design
language — a themed hero, numbered sections, square card grids, layered
architecture diagrams and a pull quote. These live here so the two generators
cannot drift into two slightly different versions of the same component.
"""
import os
import re

SRC = os.environ.get(
    "OD_SRC",
    "/home/hallelx2/dev/tools/open-design/.od/projects/240c474c-aa3f-4988-be63-7820b43deb83",
)

# ── architecture diagram ──────────────────────────────────────────────
W = 1200
BOX_H = 58
V_GAP = 46


def arch(rows, caption):
    """rows: list of (title, subtitle, style) lists — one list per layer."""
    parts, y = [], 6
    centres = []
    for row in rows:
        n = len(row)
        gap = 16
        bw = min(300, (W - (n - 1) * gap) // n)
        total = n * bw + (n - 1) * gap
        x0 = (W - total) // 2
        row_c = []
        for i, (title, sub, style) in enumerate(row):
            x = x0 + i * (bw + gap)
            cls = {"accent": "a-box a-box--accent", "pale": "a-box a-box--pale"}.get(style, "a-box")
            t_cls = "a-t a-t--on" if style == "accent" else "a-t"
            s_cls = "a-s a-s--on" if style == "accent" else "a-s"
            parts.append(f'<rect class="{cls}" x="{x}" y="{y}" width="{bw}" height="{BOX_H}" rx="12"/>')
            parts.append(f'<text class="{t_cls}" x="{x + bw/2}" y="{y + 24}" text-anchor="middle">{title}</text>')
            if sub:
                parts.append(f'<text class="{s_cls}" x="{x + bw/2}" y="{y + 42}" text-anchor="middle">{sub}</text>')
            row_c.append((x + bw / 2, y, y + BOX_H))
        centres.append(row_c)
        y += BOX_H + V_GAP

    # vertical arrows between consecutive layers, fanning to each box below
    for a, b in zip(centres, centres[1:]):
        src = a[0] if len(a) == 1 else None
        for j, (cx, top, _) in enumerate(b):
            sx = src[0] if src else a[min(j, len(a) - 1)][0]
            sy = (src[2] if src else a[min(j, len(a) - 1)][2]) + 3
            ey = top - 9
            mid = (sy + ey) / 2
            d = (f"M{sx} {sy} L{sx} {mid} L{cx} {mid} L{cx} {ey}"
                 if abs(sx - cx) > 1 else f"M{sx} {sy} L{cx} {ey}")
            parts.append(f'<path d="{d}" fill="none" stroke="var(--accent)" stroke-width="1.8"/>')
            parts.append(f'<path d="M{cx-4.5} {ey} L{cx} {ey+7} L{cx+4.5} {ey}Z" fill="var(--accent)"/>')

    h = y - V_GAP + 8
    svg = (f'<svg viewBox="0 0 {W} {h}" preserveAspectRatio="xMidYMid meet" role="img" '
           f'aria-label="{caption}">{"".join(parts)}</svg>')
    return svg


def sec(num, title, note, body):
    n = f'\n      <span class="note">{note}</span>' if note else ""
    return f'''<section class="sec">
  <div class="wrap">
    <div class="eyebrow"><span class="n">{num}</span><span class="k">{title}</span>{n}</div>
    {body}
  </div>
</section>'''


def does(items):
    return ('<div class="does" data-reveal>'
            + "".join(f'<div class="do"><b>{t}</b><p>{p}</p></div>' for t, p in items)
            + "</div>")


def talk(head, items):
    return ('<div class="talk" data-reveal><h3>' + head + "</h3><ul>"
            + "".join(f"<li><b>{t}</b>{p}</li>" for t, p in items)
            + "</ul></div>")


def table(caption, head, rows, foot=None):
    th = "".join(f"<th>{h}</th>" for h in head)
    tr = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    f = f'<p class="take">{foot}</p>' if foot else ""
    return (f'<div data-reveal><table><caption class="cap">{caption}</caption>'
            f"<thead><tr>{th}</tr></thead><tbody data-reveal>{tr}</tbody></table>{f}</div>")


def pull(quote, src):
    return ('<section><div class="pull" data-reveal>'
            f'<p>{quote}</p><span class="src">{src}</span></div></section>')


def page(slug, title, desc, mark, cat, h1, claim, tiles, sections, close_h2, close_p,
         theme="", back=("hallelx2-products.html", "All projects")):
    t = "".join(
        f'<div class="tile"><span class="v">{v}</span><span class="l">{l}</span></div>' for v, l in tiles
    )
    body = f'''<section class="phero">
  <span class="mk" aria-hidden="true" style="-webkit-mask-image:url('assets/img/marks/{mark}.svg');mask-image:url('assets/img/marks/{mark}.svg')"></span>
  <div class="in">
    <a class="back" href="{back[0]}">
      <svg aria-hidden="true"><use href="#ar"/></svg>{back[1]}</a>
    <span class="cat">{cat}</span>
    <h1>{h1}</h1>
    <p class="claim">{claim}</p>
    <div class="tiles">{t}</div>
  </div>
</section>

''' + "\n\n".join(sections) + f'''

<section class="close">
  <div class="in">
    <h2>{close_h2}</h2>
    <p>{close_p}</p>
    <div class="row">
      <a class="cta cta--light" href="{back[0]}"><span class="lbl">{back[1]}</span>
        <span class="go" aria-hidden="true"><svg><use href="#ar"/></svg></span></a>
      <a class="cta cta--ghost" href="hallelx2-how-i-work.html"><span class="lbl">How I work</span>
        <span class="go" aria-hidden="true"><svg><use href="#ar"/></svg></span></a>
    </div>
  </div>
</section>'''

    s = open(os.path.join(SRC, "hallelx2-libraries.html")).read()
    s = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", s, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*"',
               f'<meta name="description" content="{desc}"', s)
    s = s.replace('<a class="navlink" aria-current="page" href="hallelx2-libraries.html">Libraries</a>',
                  '<a class="navlink" href="hallelx2-libraries.html">Libraries</a>')
    if theme:
        s = s.replace('<html lang="en">', f'<html lang="en" class="{theme}">')
    s = re.sub(r"(<main id=\"top\">).*?(</main>)", lambda m: m.group(1) + "\n" + body + "\n" + m.group(2),
               s, flags=re.S)
    open(os.path.join(SRC, slug), "w").write(s)
    return slug




# ── the article figure ────────────────────────────────────────────────
ARROW = ('<span class="to" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" '
         'stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         'stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>')


def node(title, sub="", style=None):
    """style: 'on' for the accented step, 'off' for a struck-through alternative."""
    cls = {"on": " node--on", "off": " node--off"}.get(style, "")
    s = f'<span class="s">{sub}</span>' if sub else ""
    return f'<div class="node{cls}"><span class="t">{title}</span>{s}</div>'


def chain(nodes):
    """Nodes joined by arrows. Pass a node() string, or None for a plain gap."""
    out = []
    for i, n in enumerate(nodes):
        if i:
            out.append(ARROW)
        out.append(n)
    return f'<div class="chain">{"".join(out)}</div>'


def band(metrics):
    """A row of measured numbers under a figure. Only for figures that have them."""
    return ('<div class="band">' + "".join(
        f'<div class="m"><span class="v">{v}</span><span class="l">{l}</span></div>'
        for v, l in metrics) + "</div>")


def fig(kicker, claim, inner, caption, metrics=None):
    m = band(metrics) if metrics else ""
    return (f'<div class="fig" data-reveal><span class="kicker">{kicker}</span>'
            f"<h3>{claim}</h3>{inner}{m}"
            f'<p class="cap">{caption}</p></div>')
