# INFONET Concierge Workers

The site's Concierge widget (bottom-right on every page) works in two layers:

1. **Instant site search** — always on, fully static, no server needed.
2. **PRAX answers through a stable Worker proxy** — the widget posts to a fixed
   Worker URL, and the Worker reverse-proxies `/chat` to PRAX's current local
   Concierge tunnel.

## Worker files

- `concierge-proxy.js` — current production target for the Worker reverse proxy
  to PRAX/Hermes. This is the PR#7 path.
- `concierge.js` — optional future direct LLM-API Worker. Keep it as a separate
  follow-up option; do not deploy it for the PRAX proxy path.

The proxy Worker intentionally does **not** call Anthropic/OpenAI or any paid
external LLM API. PRAX remains the answering backend; the Worker only prevents
the public site from depending on a changing quick-tunnel hostname.

## Deploy / update

1. dash.cloudflare.com → Workers & Pages → **Create Worker** or reuse the existing
   Worker named `infonet-concierge`.
2. Worker URL expected by the widget:
   `https://infonet-concierge.heungno.workers.dev/chat`
3. Deploy `concierge-proxy.js` as the Worker code.
4. Worker → Settings → Variables/Secrets → add/update:
   - Variable: `CONCIERGE_ORIGIN=https://<current-prax-tunnel>.trycloudflare.com`
   - Secret: `PROXY_SECRET=<same value as PRAX server CONCIERGE_PROXY_SECRET>`
5. PRAX server launch env must include:
   - `CONCIERGE_PROXY_SECRET=<same hex value>`
6. Test:
   `curl -X POST https://infonet-concierge.heungno.workers.dev/chat -H 'Content-Type: application/json' -d '{"question":"연구실 입학 문의는 어떻게 하나요?","context":[]}'`

CLI deploy path once authenticated:

```bash
npx wrangler deploy
npx wrangler secret put CONCIERGE_ORIGIN
# paste: https://<current-prax-tunnel>.trycloudflare.com
npx wrangler secret put PROXY_SECRET
# paste the same value used for PRAX server CONCIERGE_PROXY_SECRET
curl -X POST https://infonet-concierge.heungno.workers.dev/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"연구실 입학 문의는 어떻게 하나요?","context":[]}'
```

When PRAX's quick tunnel rotates, update only the Worker's `CONCIERGE_ORIGIN`.
The static site endpoint does not need to change.

If you choose a different worker name, update `ENDPOINT` in
`src/components/Concierge.astro` after direct Worker validation passes.
