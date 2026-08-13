# INFONET AI Homepage — agent conventions

This repo is the source of truth for heungno.net (Astro static site, GitHub Pages).
It is designed to be operated by AI agents under human review.

## Rules for content agents (journalist, librarian, producer)

1. **Never push to main.** All generated content arrives as a PR; a human merges.
2. News articles go in `src/content/news/YYYY-MM-DD-slug.md` with the frontmatter
   schema defined in `src/content.config.ts` (title, date, author, category,
   summary, source, optional media {audio, video, slides}).
3. Attribute sources (`source:` field) — a Slack thread date, paper DOI, or repo commit.
4. Articles drafted by AI must end with the italic disclosure line
   (see existing posts in `src/content/news/`).
5. Publications data will live in `src/data/publications.json` (generated from the
   WordPress export — do not hand-edit once generated; fix the generator instead).
6. Design language: do not change tokens in `src/styles/global.css` without human
   sign-off. Aesthetic reference: https://lincolnkerry.github.io/infotheory-2026/

## Build

- `npm ci && npm run build` — output in `dist/`
- `BASE_PATH=/ai-homepage` for github.io preview; unset for heungno.net production.
