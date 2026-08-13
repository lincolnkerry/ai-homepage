import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT || 8787);
const CORPUS = process.env.CONCIERGE_CORPUS || path.join(process.cwd(), 'dist-concierge/corpus.json');
const MAX_CONTEXT = 8;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, payload) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function tokenize(s) {
  return String(s || '').toLowerCase().split(/[^a-z0-9가-힣]+/).filter((t) => t.length > 1);
}

function rankDocs(question, seedContext, docs) {
  const terms = tokenize(`${question} ${seedContext.join(' ')}`);
  const scored = docs.map((d) => {
    const title = String(d.title || '').toLowerCase();
    const hay = `${d.title} ${d.summary} ${d.text}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += 4;
      if (hay.includes(t)) score += 1;
    }
    return { d, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_CONTEXT).map((x) => x.d);
}

function safeFallback(question, docs) {
  const q = question.toLowerCase();
  const privateRouter = /privaterouter|private router|프라이빗라우터|원리|mechanism|internal/.test(q);
  const admissions = /입학|지원|admission|apply|graduate|phd|석사|박사/.test(q);
  const quality = /lv-rag|품질|평가|evaluation|benchmark|test/.test(q);

  if (privateRouter) {
    return 'PrivateRouter는 민감한 데이터 통제를 중시하는 private LLM routing 서비스/연구 방향입니다. 다만 내부 라우팅 메커니즘과 미공개 구현 원리는 공개 설명 대상이 아닙니다. 협업·평가 목적이라면 사이트의 email 링크 또는 GitHub Q&A로 문의해 주세요.';
  }
  if (admissions) {
    return '입학 문의는 INFONET Lab 연구 주제(정보이론, AI 시스템, 신호처리, Web3/블록체인)와 본인의 관심·경험을 간단히 정리한 뒤, heungno.net의 People/Research 페이지를 참고해 사이트의 email 링크로 연락하시면 됩니다. 석·박사 과정, 연구 인턴, 공동연구 가능성은 현재 공개된 연구 방향과의 적합성을 중심으로 논의합니다.';
  }
  if (quality) {
    return 'LV-RAG 품질 평가는 가능합니다. 공개적으로는 기업 문서 질의응답의 정확성, 근거 제시, 응답 일관성, 비용/지연시간 같은 지표를 기준으로 PoC 평가를 논의할 수 있습니다. 구체 데이터와 평가 절차는 공개 채널에 올리지 말고 사이트의 email 링크 또는 GitHub Q&A로 상담해 주세요.';
  }

  const refs = docs.slice(0, 3).map((d) => `${d.title} (${d.url})`).join('; ');
  return refs
    ? `사이트에서 관련 항목을 찾았습니다: ${refs}. 더 구체적인 질문을 주시면 공개 가능한 범위에서 요약해 드리겠습니다.`
    : '현재 사이트 코퍼스에서 확실한 근거를 찾지 못했습니다. heungno.net의 검색 결과를 확인하거나 GitHub Q&A/사이트 email 링크로 문의해 주세요.';
}

const corpus = JSON.parse(await readFile(CORPUS, 'utf8'));
const docs = corpus.docs || [];

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.end();
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method !== 'POST' || url.pathname !== '/chat') return json(res, 404, { error: 'POST /chat' });

  let raw = '';
  req.on('data', (chunk) => { raw += chunk; if (raw.length > 100_000) req.destroy(); });
  req.on('end', async () => {
    let body;
    try { body = JSON.parse(raw || '{}'); } catch { return json(res, 400, { error: 'bad json' }); }
    const question = String(body.question || '').slice(0, 2000).trim();
    const seedContext = Array.isArray(body.context) ? body.context.slice(0, 8).map((x) => String(x).slice(0, 500)) : [];
    if (!question) return json(res, 400, { error: 'no question' });
    const matched = rankDocs(question, seedContext, docs);
    const answer = safeFallback(question, matched);
    json(res, 200, { answer, sources: matched.slice(0, 5).map((d) => ({ title: d.title, url: d.url })) });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`INFONET Concierge /chat listening on http://127.0.0.1:${PORT}/chat with ${docs.length} docs`);
});
