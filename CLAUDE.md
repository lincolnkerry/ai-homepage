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
