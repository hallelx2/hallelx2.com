/* Generate hallelx2-activity.html into the OpenDesign source from live data.
 *
 * The page is evidence that the building is current, so it must not be
 * hand-maintained: every row here is read from GitHub, PyPI, npm and the Go
 * module proxy at build time, and the page states the date it was read.
 *
 *   node scripts/build-activity.mjs && node scripts/port.mjs
 */
import fs from "node:fs";
import path from "node:path";

const SRC = process.env.OD_SRC ??
  "/home/hallelx2/dev/tools/open-design/.od/projects/240c474c-aa3f-4988-be63-7820b43deb83";

const PYPI = ["vectorless", "swarmtorch", "context8", "yarngpt-sdk"];
const NPM = ["vectorless", "youtube-transcript-ts"];
const GO = [
  ["github.com/hallelx2/llmgate", "llmgate"],
  ["github.com/hallelx2/pdfgrab", "pdfgrab"],
  ["github.com/hallelx2/vectorless-engine", "vectorless-engine"],
];
const REG_URL = {
  PyPI: (n) => `https://pypi.org/project/${n}/`,
  npm: (n) => `https://www.npmjs.com/package/${n}`,
  Go: (n) => `https://github.com/hallelx2/${n}`,
};

const j = async (u) => (await fetch(u)).json();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── releases, every one dated ────────────────────────────────────── */
const rel = [];
for (const p of PYPI) {
  const d = await j(`https://pypi.org/pypi/${p}/json`);
  for (const [ver, files] of Object.entries(d.releases))
    if (files.length) rel.push({ date: files[0].upload_time.slice(0, 10), reg: "PyPI", name: p, ver });
}
for (const p of NPM) {
  const d = await j(`https://registry.npmjs.org/${p}`);
  for (const [ver, t] of Object.entries(d.time ?? {}))
    if (!["created", "modified"].includes(ver)) rel.push({ date: t.slice(0, 10), reg: "npm", name: p, ver });
}
for (const [mod, short] of GO) {
  const list = (await (await fetch(`https://proxy.golang.org/${mod}/@v/list`)).text()).split(/\s+/).filter(Boolean);
  for (const v of list) {
    const info = await j(`https://proxy.golang.org/${mod}/@v/${v}.info`);
    rel.push({ date: info.Time.slice(0, 10), reg: "Go", name: short, ver: v });
  }
}
rel.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

/* ── the contribution calendar ────────────────────────────────────────
   Read from GitHub's GraphQL API rather than counted here, so the graph
   is the same number GitHub itself shows. */
const { execSync } = await import("node:child_process");
// single line, and single-quoted on the shell: double quotes would let the
// shell eat $login/$from/$to before gh ever sees them.
const gql = "query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){"
  + "contributionsCollection(from:$from,to:$to){totalCommitContributions "
  + "totalPullRequestContributions totalRepositoriesWithContributedCommits "
  + "contributionCalendar{totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}";
const nowIso = new Date();
const fromIso = new Date(nowIso.getTime() - 364 * 86400000);
const contribRaw = JSON.parse(execSync(
  `gh api graphql -f query='${gql}' -f login=hallelx2 ` +
  `-f from='${fromIso.toISOString().slice(0, 19)}Z' -f to='${nowIso.toISOString().slice(0, 19)}Z'`,
  { encoding: "utf8", maxBuffer: 1 << 24 },
)).data.user.contributionsCollection;
const cal = contribRaw.contributionCalendar;
const calDays = cal.weeks.flatMap((w) => w.contributionDays);
const activeDays = calDays.filter((d) => d.contributionCount > 0).length;
const busiest = calDays.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a));

/* ── what is being worked on right now ────────────────────────────── */
const repos = JSON.parse(
  (await import("node:child_process")).execSync(
    "gh repo list hallelx2 --limit 300 --json name,description,pushedAt,isFork,url",
    { encoding: "utf8", maxBuffer: 1 << 24 },
  ),
).filter((r) => !r.isFork);
const recent = repos.sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1)).slice(0, 8);

/* ── numbers, all derived ─────────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);
const thisYear = today.slice(0, 4);
const relYear = rel.filter((r) => r.date.startsWith(thisYear));
const pkgs = new Set(rel.map((r) => r.name)).size;
const touchedYear = repos.filter((r) => r.pushedAt.startsWith(thisYear)).length;

const byMonth = {};
for (const r of relYear) byMonth[r.date.slice(0, 7)] = (byMonth[r.date.slice(0, 7)] ?? 0) + 1;
const months = [];
for (let m = 1; m <= Number(today.slice(5, 7)); m++)
  months.push(`${thisYear}-${String(m).padStart(2, "0")}`);
const peak = Math.max(...months.map((m) => byMonth[m] ?? 0), 1);
const shipped = months.filter((m) => byMonth[m]).length;

const LONG = { "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
  "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December" };
const human = (d) => `${Number(d.slice(8, 10))} ${LONG[d.slice(5, 7)]} ${d.slice(0, 4)}`;

/* ── the monthly chart, in the site's own chart component ─────────── */
// R reserves room for the value label to the right of the longest bar; at 18 the
// peak month's two-digit label was clipped by the viewBox edge.
const W = 640, L = 40, R = 46, top = 8, rowH = 26;
const bw = W - L - R;
const bars = months.map((m, i) => {
  const n = byMonth[m] ?? 0;
  const y = top + i * rowH;
  const w = (n / peak) * bw;
  return `<text class="c-ax" x="${L - 8}" y="${y + 11}" text-anchor="end" dominant-baseline="middle">${LONG[m.slice(5, 7)].slice(0, 3)}</text>`
    + `<rect x="${L}" y="${y}" width="${bw}" height="22" rx="5" fill="var(--line)" opacity=".5"/>`
    + (n ? `<rect class="grow" x="${L}" y="${y}" width="${w.toFixed(1)}" height="22" rx="5" fill="var(--accent)"/>` : "")
    + `<text class="c-val" x="${L + (n ? w : 0) + 9}" y="${y + 11}" dominant-baseline="middle">${n || ""}</text>`;
}).join("");
const chartH = top * 2 + months.length * rowH;

/* ── the heatmap, drawn in the site's own tokens ──────────────────────
   Five levels: an empty day is --line, a day with work is --accent at
   four opacities. No gradient — each cell is one flat fill, which is
   what the rest of the site does too. */
// LEFT must clear the widest day label ('Wed' at 11px) drawn right-aligned at
// LEFT-7; at 26 it was cut to 'Ved'. The viewBox likewise reserves room for the
// 'More' legend label on the right, which was clipped to a single stroke.
const CELL = 11, CGAP = 3, PITCH = CELL + CGAP, LEFT = 36, TOPM = 18, RIGHTPAD = 36;
const thresholds = [1, 4, 10, 22];          // measured against this year's spread
const levelOf = (n) => n === 0 ? 0 : n < thresholds[1] ? 1 : n < thresholds[2] ? 2 : n < thresholds[3] ? 3 : 4;
const OPACITY = [null, .28, .5, .74, 1];
const cells = cal.weeks.map((w, wi) => w.contributionDays.map((d) => {
  const lv = levelOf(d.contributionCount);
  const x = LEFT + wi * PITCH, y = TOPM + d.weekday * PITCH;
  const fill = lv === 0 ? `fill="var(--line)" opacity=".55"` : `fill="var(--accent)" opacity="${OPACITY[lv]}"`;
  return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" ${fill}><title>${d.contributionCount} on ${human(d.date)}</title></rect>`;
}).join("")).join("");
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let lastMon = -1;
const monLabels = cal.weeks.map((w, wi) => {
  const first = w.contributionDays[0];
  if (!first) return "";
  const m = Number(first.date.slice(5, 7)) - 1;
  if (m === lastMon) return "";
  lastMon = m;
  return `<text class="c-ax" x="${LEFT + wi * PITCH}" y="${TOPM - 6}">${MON[m]}</text>`;
}).join("");
const dayLabels = [1, 3, 5].map((wd) =>
  `<text class="c-ax" x="${LEFT - 7}" y="${TOPM + wd * PITCH + CELL / 2}" text-anchor="end" dominant-baseline="middle">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][wd]}</text>`).join("");
const legend = [0, 1, 2, 3, 4].map((lv, i) => {
  const x = LEFT + cal.weeks.length * PITCH - 5 * PITCH + i * PITCH;
  const fill = lv === 0 ? `fill="var(--line)" opacity=".55"` : `fill="var(--accent)" opacity="${OPACITY[lv]}"`;
  return `<rect x="${x}" y="${TOPM + 7 * PITCH + 10}" width="${CELL}" height="${CELL}" rx="2.5" ${fill}/>`;
}).join("");
const gW = LEFT + cal.weeks.length * PITCH + RIGHTPAD;
const gH = TOPM + 7 * PITCH + 10 + CELL + 4;
const heatmap = `<svg viewBox="0 0 ${gW} ${gH}" preserveAspectRatio="xMinYMid meet" role="img" aria-label="${cal.totalContributions} contributions over the last year, one square per day.">${monLabels}${dayLabels}${cells}<text class="c-ax" x="${LEFT + cal.weeks.length * PITCH - 5 * PITCH - 8}" y="${TOPM + 7 * PITCH + 10 + CELL / 2}" text-anchor="end" dominant-baseline="middle">Less</text>${legend}<text class="c-ax" x="${LEFT + cal.weeks.length * PITCH + 2}" y="${TOPM + 7 * PITCH + 10 + CELL / 2}" dominant-baseline="middle">More</text></svg>`;

/* ── markup ───────────────────────────────────────────────────────── */
const GO_ARROW = '<span class="go" aria-hidden="true"><svg><use href="#ar"/></svg></span>';
const nowRows = recent.map((r) => `<a class="ev" href="${r.url}" target="_blank" rel="noopener">`
  + `<span class="when">${human(r.pushedAt.slice(0, 10))}</span>`
  + `<span class="main"><b>${esc(r.name)}</b><p>${esc(r.description || "No description in the repository.")}</p></span>`
  + `<span class="nums"></span>${GO_ARROW}</a>`).join("");

const logRows = rel.map((r) => `<tr><td>${human(r.date)}</td><td><a href="${REG_URL[r.reg](r.name)}" `
  + `target="_blank" rel="noopener">${esc(r.name)}</a></td><td>${r.reg}</td><td>${esc(r.ver)}</td></tr>`).join("");

const main = `<section class="phero">
  <span class="mk" aria-hidden="true" style="-webkit-mask-image:url('assets/img/marks/activity.svg');mask-image:url('assets/img/marks/activity.svg')"></span>
  <div class="in">
    <a class="back" href="hallelx2-landing.html">
      <svg aria-hidden="true"><use href="#ar"/></svg>hallelx2 labs</a>
    <span class="cat">Read live &middot; ${human(today)}</span>
    <h1>Activity</h1>
    <p class="claim">The last thing I shipped went out on ${human(rel[0].date)}.</p>
    <div class="tiles"><div class="tile"><span class="v">${rel.length}</span><span class="l">releases published across ${pkgs} packages</span></div><div class="tile"><span class="v">${relYear.length}</span><span class="l">of them this year, in ${shipped} different months</span></div><div class="tile"><span class="v">${touchedYear}</span><span class="l">repositories pushed to in ${thisYear}</span></div></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="eyebrow"><span class="n">01</span><span class="k">Every day of the last year</span>
      <span class="note">${cal.totalContributions.toLocaleString()} contributions, read from GitHub on ${human(today)}.</span></div>
    <div class="chart wide heat" data-reveal><h3>${activeDays} of ${calDays.length} days had something in them</h3>
      <p class="cap">One square per day &middot; ${human(calDays[0].date)} to ${human(calDays[calDays.length - 1].date)}</p>
      ${heatmap}
      <p class="take">${contribRaw.totalCommitContributions.toLocaleString()} commits and ${contribRaw.totalPullRequestContributions}
        pull requests across ${contribRaw.totalRepositoriesWithContributedCommits} repositories. The busiest single day was
        <b>${human(busiest.date)}</b>, at ${busiest.contributionCount}. <b>The blank squares are real</b> &mdash; clinical
        weeks and exam weeks look exactly like what they were.</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="eyebrow"><span class="n">02</span><span class="k">What I touched last</span>
      <span class="note">The eight most recently pushed repositories, newest first.</span></div>
    <div class="events" data-reveal>${nowRows}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="eyebrow"><span class="n">03</span><span class="k">Cadence</span>
      <span class="note">Published releases per month, ${thisYear}.</span></div>
    <div class="charts">
      <div class="chart wide" data-reveal><h3>When the work actually left the building</h3>
        <p class="cap">Releases published per month &middot; ${thisYear}</p>
        <svg viewBox="0 0 ${W} ${chartH}" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">${bars}</svg>
        <p class="take">${relYear.length} releases in ${shipped} of ${months.length} months. The quiet months are real
          and are shown as quiet &mdash; <b>a flat month is a month I was building something not yet published.</b></p>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="eyebrow"><span class="n">04</span><span class="k">Every release</span>
      <span class="note">All ${rel.length}, oldest at the bottom. Each links to its registry.</span></div>
    <div class="metric" data-reveal>
      <table>
        <caption class="cap">Published releases, read from PyPI, npm and the Go module proxy on ${human(today)}</caption>
        <thead><tr><th>Date</th><th>Package</th><th>Registry</th><th>Version</th></tr></thead>
        <tbody data-reveal>${logRows}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="close">
  <div class="in">
    <h2>Nothing on this page was typed by hand.</h2>
    <p>It is generated from GitHub, PyPI, npm and the Go module proxy, so it cannot
      flatter me and it cannot go quietly out of date. If a month here is empty, that is
      what the registries say.</p>
    <div class="row">
      <a class="cta cta--light" href="hallelx2-libraries.html"><span class="lbl">The libraries</span>
        <span class="go" aria-hidden="true"><svg><use href="#ar"/></svg></span></a>
      <a class="cta cta--ghost" href="https://github.com/hallelx2" target="_blank" rel="noopener"><span class="lbl">All the source</span>
        <span class="go" aria-hidden="true"><svg><use href="#ar"/></svg></span></a>
    </div>
  </div>
</section>`;

let s = fs.readFileSync(path.join(SRC, "hallelx2-libraries.html"), "utf8");
s = s.replace(/<title>.*?<\/title>/s, "<title>Activity &mdash; hallelx2 labs</title>");
s = s.replace(/<meta name="description" content="[^"]*"/,
  `<meta name="description" content="What I have shipped and when, generated from GitHub, PyPI, npm and the Go module proxy. ${rel.length} releases across ${pkgs} packages."`);
s = s.replace('<a class="navlink" aria-current="page" href="hallelx2-libraries.html">Libraries</a>',
              '<a class="navlink" href="hallelx2-libraries.html">Libraries</a>');
s = s.replace(/(<main id="top">).*?(<\/main>)/s, (_, a, b) => `${a}\n${main}\n${b}`);
fs.writeFileSync(path.join(SRC, "hallelx2-activity.html"), s);

fs.writeFileSync(path.join(SRC, "assets/img/marks/activity.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<title>Activity — what shipped, and when</title>
<path d="M6 34h6V22H6zM19 34h6V12h-6zM32 34h6V26h-6z"/>
<path d="M4 41h40"/>
</svg>
`);
console.log(`activity page: ${rel.length} releases, ${pkgs} packages, ${touchedYear} repos in ${thisYear}, latest ${rel[0].date}`);
