// Build a flat, local retrieval corpus for the PRAX concierge /chat endpoint.
//
// This mirrors the EXACT data-extraction logic in src/pages/search-index.json.ts,
// but reads the sources with node:fs (Astro's import resolver is not available in
// a plain .mjs). Output: concierge-corpus.json at the repo root, shape { count, docs }
// where each doc is { id, t, s, u, k }.
//
// Pure Node, no npm dependencies, no network calls.

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// --- helpers -----------------------------------------------------------------

const strip = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Strip markdown syntax down to plain text (defensive, best-effort).
const stripMarkdown = (s) =>
  String(s || '')
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/<[^>]+>/g, ' ') // html tags
    .replace(/[#>*_~`|-]+/g, ' ') // md punctuation
    .replace(/\s+/g, ' ')
    .trim();

// Minimal YAML frontmatter parser (only the flat scalar keys we need).
function parseFrontmatter(raw) {
  const m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    let val = kv[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[kv[1]] = val;
  }
  return { data, body: m[2] || '' };
}

function readJSON(relPath) {
  const p = join(ROOT, relPath);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// --- build -------------------------------------------------------------------

const docs = [];
let idn = 0;
const nextId = () => 'd' + ++idn;

// 1) News articles (src/content/news/*.md)
const newsDir = join(ROOT, 'src/content/news');
if (existsSync(newsDir)) {
  const files = readdirSync(newsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  for (const f of files) {
    try {
      const raw = readFileSync(join(newsDir, f), 'utf8');
      const { data, body } = parseFrontmatter(raw);
      docs.push({
        id: nextId(),
        t: data?.title || f.replace(/\.md$/, ''),
        s: data?.summary || '',
        u: '/news/' + f.replace(/\.md$/, ''),
        k: stripMarkdown(body).slice(0, 1200),
      });
    } catch {
      // skip unreadable file
    }
  }
}

// 2) Publications (src/data/publications.json)
const pubs = readJSON('src/data/publications.json') || {};
const pubGroups = [
  ['international', 'International'],
  ['domestic', 'Domestic'],
  ['dissertations', 'Dissertations'],
];
for (const [gk, gl] of pubGroups) {
  const grp = pubs?.[gk] || {};
  for (const sec of Object.keys(grp)) {
    const entries = grp?.[sec] || [];
    if (!Array.isArray(entries)) continue;
    for (const e of entries) {
      docs.push({
        id: nextId(),
        t: gl + ' ' + sec + ' #' + (e?.n ?? ''),
        s: '',
        u: '/publications',
        k: strip(e?.text).slice(0, 400),
      });
    }
  }
}

// 3) Projects (src/data/projects.json)
const projects = readJSON('src/data/projects.json') || [];
if (Array.isArray(projects)) {
  for (const p of projects) {
    docs.push({
      id: nextId(),
      t: 'Project: ' + (p?.title || ''),
      s: p?.summary || '',
      u: '/research',
      k: (p?.title || '') + ' ' + (p?.summary || ''),
    });
  }
}

// 4) Business / ventures (src/data/biz.json)
const biz = readJSON('src/data/biz.json') || [];
if (Array.isArray(biz)) {
  for (const b of biz) {
    docs.push({
      id: nextId(),
      t: (b?.name || '') + ' (' + (b?.tag || '') + ')',
      s: b?.summary || '',
      u: '/biz',
      k: (b?.name || '') + ' ' + (b?.summary || ''),
    });
  }
}

// 5) Static section docs (same hardcoded set as search-index.json.ts)
docs.push({
  id: nextId(),
  t: 'People — Professor Heung-No Lee & members',
  s: '',
  u: '/people',
  k: 'professor heung-no lee members alumni admission international students apply phd ms',
});
docs.push({
  id: nextId(),
  t: 'Education — courses, lectures, videos',
  s: '',
  u: '/education',
  k: 'courses information theory blockchain generative ai lectures youtube videos watch AI teaching assistant',
});
docs.push({
  id: nextId(),
  t: 'Code & Demos — open source and live demos',
  s: '',
  u: '/code',
  k: 'github worldland eth-ecc sdk miner lv-rag jireumgil shortcut demo download run',
});

// --- write -------------------------------------------------------------------

const out = { count: docs.length, docs };
writeFileSync(join(ROOT, 'concierge-corpus.json'), JSON.stringify(out, null, 2));
console.log(`concierge corpus: wrote ${docs.length} docs to concierge-corpus.json`);
