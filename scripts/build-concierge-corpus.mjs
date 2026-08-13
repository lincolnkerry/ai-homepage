import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'dist-concierge');
const OUT_FILE = path.join(OUT_DIR, 'corpus.json');

const stripHtml = (s) => s.replace(/<[^>]+>/g, ' ');
const clean = (s) => stripHtml(String(s || ''))
  .replace(/---[\s\S]*?---/, ' ')
  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[site email link]')
  .replace(/mailto:\S+/gi, '[site email link]')
  .replace(/[`*_#>\[\](){}/\\|-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return data;
}

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function main() {
  const docs = [];
  docs.push({
    title: 'People — Professor Heung-No Lee & members',
    url: '/people',
    summary: 'INFONET Lab people, professor, members, alumni, admissions and application contact path.',
    text: 'People Professor Heung-No Lee members alumni admission admissions apply PhD MS graduate student research intern 입학 지원 석사 박사 대학원 연구실 인턴 구성원 졸업생 교수님 GIST INFONET Lab',
  });
  docs.push({
    title: 'Code & Demos — LV-RAG, open source and live demos',
    url: '/code',
    summary: 'GitHub repositories, demos, LV-RAG, Jireumgil Shortcut, and runnable code.',
    text: 'code demos github repositories LV-RAG RAG 품질 평가 benchmark evaluation demo download run 지름길 Shortcut',
  });

  const pageDir = path.join(ROOT, 'src/pages');
  for await (const file of walk(pageDir)) {
    if (!/\.(astro|md|mdx|ts)$/.test(file)) continue;
    if (file.includes('[...slug]') || file.endsWith('search-index.json.ts')) continue;
    const rel = path.relative(path.join(ROOT, 'src/pages'), file);
    const url = '/' + rel
      .replace(/index\.astro$/, '')
      .replace(/\.astro$/, '')
      .replace(/\.mdx?$/, '')
      .replace(/\.ts$/, '')
      .replace(/\\/g, '/');
    const raw = await readFile(file, 'utf8');
    const text = clean(raw).slice(0, 1400);
    if (text) docs.push({ title: `Page: ${url || '/'}`, url: url || '/', summary: text.slice(0, 220), text });
  }

  const newsDir = path.join(ROOT, 'src/content/news');
  for await (const file of walk(newsDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = await readFile(file, 'utf8');
    const fm = frontmatter(raw);
    const slug = path.basename(file, '.md');
    const body = raw.replace(/^---\n[\s\S]*?\n---/, '');
    docs.push({
      title: fm.title || slug,
      url: `/news/${slug}`,
      summary: fm.summary || clean(body).slice(0, 220),
      text: clean(`${fm.title || ''} ${fm.summary || ''} ${body}`).slice(0, 1800),
    });
  }

  for (const dataFile of ['projects.json', 'biz.json', 'playlists.json']) {
    const p = path.join(ROOT, 'src/data', dataFile);
    const raw = await readFile(p, 'utf8').catch(() => null);
    if (!raw) continue;
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : Object.values(data).flatMap((v) => Array.isArray(v) ? v : Object.values(v || {}).flat());
    for (const item of arr) {
      const title = item.title || item.name || item.label || dataFile;
      const summary = item.summary || item.description || '';
      docs.push({ title, url: dataFile === 'biz.json' ? '/biz' : dataFile === 'projects.json' ? '/research' : '/education', summary, text: clean(JSON.stringify(item)).slice(0, 1200) });
    }
  }

  const pubsRaw = await readFile(path.join(ROOT, 'src/data/publications.json'), 'utf8');
  const pubs = JSON.parse(pubsRaw);
  for (const group of Object.values(pubs)) {
    for (const entries of Object.values(group)) {
      for (const e of entries) {
        docs.push({ title: `Publication #${e.n}`, url: '/publications', summary: e.text.slice(0, 220), text: e.text.slice(0, 1000) });
      }
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), docs }, null, 2));
  console.log(`Wrote ${docs.length} concierge documents to ${OUT_FILE}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
