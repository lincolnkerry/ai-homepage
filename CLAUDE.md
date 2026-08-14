# INFONET AI Homepage — agent conventions

This repo is the source of truth for heungno.net (Astro static site, GitHub Pages).
It is designed to be operated by AI agents under human review.

## Agent team (assigned 2026-08-13)

- **Argus** (Hermes) — AI journalist: drafts articles from Slack, gets the
  professor's approval in Slack, then hands the approved file to @Claude.
- **Sedol** — chief of staff / editor-in-chief: editorial review before approval.
- **@Claude** (Slack) — GitHub manager & publisher: commits professor-approved
  articles and maintains the repo.
- **PRAX** (Hermes) — public concierge: serves the Concierge widget endpoint
  (`POST /chat` {question, context[]} -> {answer}; endpoint constant lives in
  `src/components/Concierge.astro`).

## Rules for content agents

1. **Publishing rule.** An article may be committed directly to main ONLY if it
   already carries the professor's explicit approval in Slack; the commit message
   must include the Slack permalink of that approval. Everything else — and ALL
   code/layout/script changes by any agent — goes through a PR that a human merges.
2. News articles go in `src/content/news/YYYY-MM-DD-slug.md` with the frontmatter
   schema defined in `src/content.config.ts` (title, date, author, category,
   summary, source, optional media {audio, video, slides}).
3. Attribute sources (`source:` field) — a Slack thread date, paper DOI, or repo commit.
4. Articles drafted by AI must end with the italic disclosure line
   (see existing posts in `src/content/news/`).
4b. **Never publish a plaintext email address** anywhere on the site. Use the
   click-to-reveal pattern: `<a href="#" class="em" data-u="user" data-d="domain">user [at] domain</a>`
   (the assembler script lives in `src/layouts/Base.astro`).
5. Publications data will live in `src/data/publications.json` (generated from the
   WordPress export — do not hand-edit once generated; fix the generator instead).
6. Design language: do not change tokens in `src/styles/global.css` without human
   sign-off. Aesthetic reference: https://lincolnkerry.github.io/infotheory-2026/

## Build

- `npm ci && npm run build` — output in `dist/`
- `BASE_PATH=/ai-homepage` for github.io preview; unset for heungno.net production.

## Concierge operation variables

The public Concierge bridge is implemented in `scripts/concierge-server.mjs`; the
widget endpoint constant lives in `src/components/Concierge.astro`. Keep runtime
settings in the server launch environment (launchd/script/.env), not in visitor
code.

| Variable | Code default | Meaning | Recommended operation value |
| --- | ---: | --- | --- |
| `PORT` | `8787` | Local HTTP port. Server binds `127.0.0.1`; expose through Cloudflare Tunnel or another local-only proxy. | `8787` unless occupied |
| `CONCIERGE_CORPUS` | `dist-concierge/corpus.json` | Built Concierge corpus path. Generate with `npm run concierge:index`. | default |
| `HERMES_BIN` | `hermes` | Hermes CLI used for PRAX generation. | absolute path, e.g. `/Users/heungno/.hermes/hermes-agent/venv/bin/hermes` |
| `CONCIERGE_HERMES_TIMEOUT_MS` | `10000` | Max time to wait for Hermes before returning fallback. | `10000` |
| `CONCIERGE_MAX_CONCURRENT` | `6` | Max concurrent Hermes child processes. Measure one Hermes RSS first; if `6 * RSS` exceeds 60% of available RAM, lower to `4`. | `6` on PRAX after RSS check |
| `CONCIERGE_RATE_WINDOW_MS` | `60000` | Per-IP rate-limit window. | `60000` |
| `CONCIERGE_RATE_LIMIT_MAX` | `12` | Per-IP requests per window. Keep below or near total service capacity; do not raise for NAT demos without a separate allowlist PR. | `12` |

For lectures/demos behind campus NAT, prefer a future `CONCIERGE_RATE_EXEMPT_IPS`
allowlist PR over raising `CONCIERGE_RATE_LIMIT_MAX` globally. A separate follow-up
PR should add timeout escalation from SIGTERM to SIGKILL after a short grace period
so stuck Hermes children cannot outlive their semaphore slots.
