# INFONET Concierge Worker

The site's Concierge widget (bottom-right on every page) works in two layers:

1. **Instant site search** — always on, fully static, no server needed.
2. **PRAX answers** — the widget posts to a stable Cloudflare Worker URL, and the
   Worker reverse-proxies `/chat` to PRAX's current local Concierge tunnel.

This Worker intentionally does **not** call Anthropic/OpenAI or any paid external
LLM API. PRAX remains the answering backend; the Worker only prevents the public
site from depending on a changing quick-tunnel hostname.

## Deploy / update

1. dash.cloudflare.com → Workers & Pages → **Create Worker**
2. Name: `infonet-concierge` (the widget expects
   `https://infonet-concierge.heungno.workers.dev/chat`)
3. Paste `concierge.js` as the Worker code → Deploy
4. Worker → Settings → Variables → add/update:
   - `CONCIERGE_ORIGIN=https://<current-prax-tunnel>.trycloudflare.com`
   - Optional: `ALLOWED_ORIGIN=https://heungno.net`
5. Test:
   `curl -X POST https://infonet-concierge.heungno.workers.dev/chat -H 'Content-Type: application/json' -d '{"question":"연구실 입학 문의는 어떻게 하나요?","context":[]}'`

When PRAX's quick tunnel rotates, update only the Worker's `CONCIERGE_ORIGIN`.
The static site endpoint does not need to change.

If you choose a different worker name, update `ENDPOINT` in
`src/components/Concierge.astro`.
