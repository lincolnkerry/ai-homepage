// INFONET Concierge — Cloudflare Worker reverse proxy to PRAX (Hermes bridge).
// 위젯이 {question, context[]}를 여기로 POST하면, PRAX 터널로 그대로 전달하고
// 응답을 그대로 돌려준다.
// Vars: CONCIERGE_ORIGIN (터널 base URL), PROXY_SECRET (공유 시크릿, Secret로 등록)
// 후속 옵션: workers/concierge.js 는 LLM API를 직접 호출하는 버전이다.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function offline() {
  return {
    answer: '이 질문과 관련된 사이트 페이지를 찾았습니다. 더 자세한 내용은 사이트 문의 링크를 이용해 주세요. (I found site pages related to this question. For more details, please use the site inquiry link.)',
    sources: [],
    agent: 'offline',
  };
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    if (req.method !== 'POST' || !url.pathname.endsWith('/chat')) {
      return json({ error: 'POST /chat' }, 404);
    }
    const body = await req.text();
    if (body.length > 100000) return json({ error: 'payload too large' }, 413);

    const origin = String(env.CONCIERGE_ORIGIN || '').replace(/\/$/, '');
    if (!origin) return json(offline(), 200);

    try {
      const upstream = await fetch(origin + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Visitor-IP': req.headers.get('CF-Connecting-IP') || '',
          'X-Proxy-Secret': env.PROXY_SECRET || '',
        },
        body,
        signal: AbortSignal.timeout(25000),
      });
      if (upstream.status >= 500) return json(offline(), 200);
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
      });
    } catch (e) {
      console.log('proxy upstream failure:', String((e && e.message) || e).slice(0, 200));
      return json(offline(), 200);
    }
  },
};
