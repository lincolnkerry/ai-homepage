// Build-time search index for the Concierge widget.
// Regenerated on every build from the live content collections.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import pubs from '../data/publications.json';
import projects from '../data/projects.json';
import biz from '../data/biz.json';

const strip = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async () => {
  const docs: { id: string; t: string; s: string; u: string; k: string }[] = [];
  let idn = 0;
  const nextId = () => 'd' + ++idn;

  const posts = await getCollection('news');
  for (const p of posts) {
    docs.push({
      id: nextId(),
      t: p.data.title,
      s: p.data.summary,
      u: '/news/' + p.id.replace(/\.md$/, ''),
      k: strip(p.body || '').slice(0, 1200),
    });
  }

  const pubGroups: [string, string][] = [
    ['international', 'International'], ['domestic', 'Domestic'], ['dissertations', 'Dissertations'],
  ];
  for (const [gk, gl] of pubGroups) {
    const grp = (pubs as any)[gk] || {};
    for (const sec of Object.keys(grp)) {
      for (const e of grp[sec]) {
        docs.push({ id: nextId(), t: gl + ' ' + sec + ' #' + e.n, s: '', u: '/publications', k: e.text.slice(0, 400) });
      }
    }
  }

  for (const p of projects as any[]) {
    docs.push({ id: nextId(), t: 'Project: ' + p.title, s: p.summary, u: '/research', k: p.title + ' ' + p.summary });
  }
  for (const b of biz as any[]) {
    docs.push({ id: nextId(), t: b.name + ' (' + b.tag + ')', s: b.summary, u: '/biz', k: b.name + ' ' + b.summary });
  }
  docs.push({ id: nextId(), t: 'People — Professor Heung-No Lee & members', s: '', u: '/people', k: 'professor heung-no lee members alumni admission international students apply phd ms' });
  docs.push({ id: nextId(), t: 'Education — courses, lectures, videos', s: '', u: '/education', k: 'courses information theory blockchain generative ai lectures youtube videos watch AI teaching assistant' });
  docs.push({ id: nextId(), t: 'Code & Demos — open source and live demos', s: '', u: '/code', k: 'github worldland eth-ecc sdk miner lv-rag jireumgil shortcut demo download run' });

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json' },
  });
};
