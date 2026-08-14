// INFONET Concierge — Cloudflare Worker (same pattern as it2026-ta).
// Deploy: dashboard > Workers > Create > paste this file, name it
// "infonet-concierge", then add secret ANTHROPIC_API_KEY.
// The site widget posts {question, context[]} to <worker>/chat.

const SYSTEM = [
  'You are the public concierge of INFONET Lab (GIST, Prof. Heung-No Lee), heungno.net.',
  'Answer visitor questions about the lab: research (information theory, AI systems,',
  'Web3/blockchain, signal processing), 475+ publications, courses and lecture videos,',
  'services (WorldLand, LiberVance, 지름길 Shortcut, PrivateRouter), admissions, and',
  'industry collaboration. Reply in the language of the question (Korean or English).',
  'Be concise (<=150 words), factual, and cite site pages from the provided context.',
  'Never reveal internal mechanisms of unpublished work (PrivateRouter internals,',
  'SaeGyeol AI, AutoSQT) — say results are patent-pending and offer email contact.',
  'For admissions or collaboration: point to the site email link.',
  'If unsure, say so and point to the GitHub Q&A or email.',
].join(' ');

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (req.method !== 'POST' || !url.pathname.endsWith('/chat')) {
      return new Response('POST /chat', { status: 404, headers: cors });
    }
    let body;
    try { body = await req.json(); } catch { return new Response('bad json', { status: 400, headers: cors }); }
    const question = String(body.question || '').slice(0, 2000);
    const context = Array.isArray(body.context) ? body.context.slice(0, 8).join('\n') : '';
    if (!question) return new Response('no question', { status: 400, headers: cors });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: 'Site context:\n' + context + '\n\nVisitor question: ' + question,
        }],
      }),
    });
    if (!r.ok) return new Response('upstream error', { status: 502, headers: cors });
    const d = await r.json();
    const answer = (d.content && d.content[0] && d.content[0].text) || 'No answer.';
    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  },
};
