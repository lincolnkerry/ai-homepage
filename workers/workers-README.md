# INFONET Concierge Worker

The site's Concierge widget (bottom-right on every page) works in two layers:

1. **Instant site search** — always on, fully static, no server needed.
2. **LLM answers** — live once this Worker is deployed. Until then the widget
   gracefully shows search results plus a pointer to GitHub Q&A / email.

## Deploy (5 minutes, same pattern as it2026-ta)

1. dash.cloudflare.com → Workers & Pages → **Create Worker**
2. Name: `infonet-concierge` (the widget expects
   `https://infonet-concierge.heungno.workers.dev/chat`)
3. Paste `concierge.js` as the Worker code → Deploy
4. Worker → Settings → Variables → **Add secret**: `ANTHROPIC_API_KEY`
5. Test:
   `curl -X POST https://infonet-concierge.heungno.workers.dev/chat -H 'Content-Type: application/json' -d '{"question":"연구실 입학 문의는 어떻게 하나요?","context":[]}'`

If you choose a different worker name, update `ENDPOINT` in
`src/components/Concierge.astro`.
