// INFONET Concierge — Cloudflare Worker reverse proxy.
//
// Purpose: keep the public widget endpoint stable while PRAX's local
// Cloudflare quick tunnel URL changes. The Worker does not call any paid
// external LLM API; it only forwards /chat to the PRAX local Concierge origin.
//
// Required Worker variable:
//   CONCIERGE_ORIGIN=https://<current-prax-tunnel>.trycloudflare.com
// Optional Worker variable:
//   ALLOWED_ORIGIN=https://heungno.net

const DEFAULT_ALLOWED_ORIGIN = '*';

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(status, payload, env) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(env),
    },
  });
}

function upstreamChatUrl(env) {
  const origin = String(env.CONCIERGE_ORIGIN || '').trim().replace(/\/+$/, '');
  if (!origin) return null;
  return `${origin}/chat`;
}

export default {
  async fetch(req, env) {
    const cors = corsHeaders(env);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(req.url);
    if (req.method !== 'POST' || url.pathname !== '/chat') {
      return json(404, { error: 'POST /chat' }, env);
    }

    const target = upstreamChatUrl(env);
    if (!target) {
      return json(503, { error: 'CONCIERGE_ORIGIN is not configured' }, env);
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return json(415, { error: 'content-type must be application/json' }, env);
    }

    let body;
    try {
      body = await req.text();
      JSON.parse(body || '{}');
    } catch {
      return json(400, { error: 'bad json' }, env);
    }

    let upstream;
    try {
      upstream = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': url.host,
        },
        body,
      });
    } catch {
      return json(502, { error: 'concierge origin unreachable' }, env);
    }

    const responseHeaders = {
      'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
      ...cors,
    };
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  },
};
