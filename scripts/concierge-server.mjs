// PRAX concierge /chat endpoint — LOCAL retrieval over the site's own content.
//
// Contract: POST /chat {question, context[]} -> {answer, sources?}
// Pure Node (node:http), no npm dependencies, no external network calls, no API keys.
// It answers ONLY from concierge-corpus.json (built by build-concierge-corpus.mjs),
// with a safe fallback when nothing matches.

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CORPUS_PATH = join(ROOT, 'concierge-corpus.json');
const PORT = Number(process.env.PORT) || 8787;

// --- load corpus -------------------------------------------------------------

if (!existsSync(CORPUS_PATH)) {
  console.error(
    'concierge-corpus.json not found.\n' +
      'Build it first:  npm run concierge:corpus\n' +
      '(runs scripts/build-concierge-corpus.mjs)'
  );
  process.exit(1);
}

let corpus;
try {
  corpus = JSON.parse(readFileSync(CORPUS_PATH, 'utf8'));
} catch (e) {
  console.error('Failed to parse concierge-corpus.json:', e?.message || e);
  process.exit(1);
}
const DOCS = Array.isArray(corpus?.docs) ? corpus.docs : [];

// --- retrieval ---------------------------------------------------------------

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for',
  'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did',
  'how', 'what', 'when', 'where', 'who', 'why', 'which', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'me',
  'with', 'as', 'by', 'from', 'about', 'into', 'can', 'will', 'would', 'should',
  'could', 'may', 'have', 'has', 'had', 'get', 'got', 'if', 'then', 'so', 'up',
  'out', 'not', 'no', 'yes', 'please', 'there',
]);

const TOKEN_RE = /[a-z0-9가-힣]+/g;

function tokenize(s) {
  const norm = String(s || '')
    .normalize('NFKC')
    .toLowerCase();
  const out = [];
  const matches = norm.match(TOKEN_RE) || [];
  for (const tok of matches) {
    if (tok.length <= 1) continue;
    if (STOPWORDS.has(tok)) continue;
    out.push(tok);
  }
  return out;
}

// Precompute per-doc token sets for title and full text.
const INDEX = DOCS.map((d) => {
  const titleTokens = new Set(tokenize(d?.t));
  const bodyText = [d?.t, d?.s, d?.k].filter(Boolean).join(' ');
  const bodyTokens = new Set(tokenize(bodyText));
  return { doc: d, titleTokens, bodyTokens };
});

function search(question, limit = 4) {
  const qTokens = [...new Set(tokenize(question))];
  if (qTokens.length === 0) return [];
  const scored = [];
  for (const entry of INDEX) {
    let score = 0;
    for (const t of qTokens) {
      if (entry.bodyTokens.has(t)) score += 1;
      if (entry.titleTokens.has(t)) score += 2; // title-match boost
    }
    if (score > 0) scored.push({ score, doc: entry.doc });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// --- answer composition ------------------------------------------------------

function composeAnswer(hits) {
  const lines = [];
  lines.push(
    'Here is what I found on the INFONET site that matches your question:'
  );
  lines.push('');
  for (const h of hits) {
    const d = h.doc;
    const title = d?.t || 'Untitled';
    const url = d?.u || '/';
    const summary = (d?.s || '').trim();
    lines.push(`• ${title} — ${url}`);
    if (summary) lines.push(`  ${summary}`);
  }
  lines.push('');
  lines.push(
    'Browse more on the site: News, Publications, Research, People, Education, and Code sections.'
  );
  return lines.join('\n');
}

function fallbackAnswer() {
  return [
    "I couldn't find a page on the INFONET site that directly matches that.",
    '',
    'Try one of these sections:',
    '• News — /news (latest lab updates and journal-club write-ups)',
    '• Publications — /publications (journals, conferences, dissertations)',
    '• Research — /research (current projects)',
    '• People — /people (professor, members, admissions info)',
    '• Education — /education (courses, lectures, videos)',
    '• Code & Demos — /code (open-source and live demos)',
    '',
    'If you need to reach the lab, please use the contact form on the site.',
  ].join('\n');
}

// --- HTTP --------------------------------------------------------------------

const MAX_BODY = 100 * 1024; // ~100KB
const MAX_QUESTION = 2000;
const MAX_CONTEXT = 8;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

const server = createServer((req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = (req.url || '/').split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/health')) {
    sendJSON(res, 200, { ok: true, docs: DOCS.length });
    return;
  }

  if (req.method === 'POST' && url === '/chat') {
    let raw = '';
    let tooBig = false;
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY) {
        tooBig = true;
        req.destroy();
      }
    });
    req.on('close', () => {
      if (tooBig && !res.headersSent) {
        sendJSON(res, 413, { error: 'Request body too large.' });
      }
    });
    req.on('end', () => {
      if (tooBig) return;
      let payload;
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        sendJSON(res, 400, { error: 'Invalid JSON body.' });
        return;
      }

      let question =
        typeof payload?.question === 'string' ? payload.question : '';
      question = question.slice(0, MAX_QUESTION).trim();

      let context = Array.isArray(payload?.context)
        ? payload.context.slice(0, MAX_CONTEXT)
        : [];

      if (!question) {
        sendJSON(res, 400, { error: 'Missing "question".' });
        return;
      }

      const hits = search(question, 4);
      if (hits.length === 0) {
        sendJSON(res, 200, { answer: fallbackAnswer(), sources: [] });
        return;
      }

      const answer = composeAnswer(hits);
      const sources = hits.map((h) => ({
        title: h.doc?.t || '',
        url: h.doc?.u || '',
        summary: h.doc?.s || '',
      }));
      sendJSON(res, 200, { answer, sources });
    });
    return;
  }

  sendJSON(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(
    `PRAX concierge /chat server listening on http://localhost:${PORT} (${DOCS.length} docs, local retrieval only)`
  );
});
