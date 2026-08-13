#!/usr/bin/env python3
"""
INFONET AI Journalist — Slack → news article PR.

Weekly (or on demand), this script:
  1. reads the past N days of the lab's Slack channels (incl. thread replies),
  2. asks Claude to pick 0-2 PUBLIC-safe newsworthy stories and write articles
     in the site's frontmatter schema (see src/content.config.ts),
  3. writes them to src/content/news/ and opens a pull request.

A human merges the PR; nothing publishes without review (see CLAUDE.md).

Required env: SLACK_BOT_TOKEN, ANTHROPIC_API_KEY
Optional env: SLACK_CHANNELS (comma-sep IDs; default #research_all),
              DAYS (default 7), MODEL (default claude-sonnet-4-5)
Run in GitHub Actions (see .github/workflows/journalist.yml) or locally.
"""
import os, re, json, time, urllib.request, subprocess, datetime, pathlib, sys

SLACK = 'https://slack.com/api'
TOKEN = os.environ['SLACK_BOT_TOKEN']
CHANNELS = os.environ.get('SLACK_CHANNELS', 'C036DEDPH71').split(',')
DAYS = int(os.environ.get('DAYS', '7'))
MODEL = os.environ.get('MODEL', 'claude-sonnet-4-5')
ROOT = pathlib.Path(__file__).resolve().parent.parent
NOISE = re.compile(r'HEARTBEAT_OK|^\s*$')


def slack(method, **params):
    q = urllib.parse.urlencode(params)
    req = urllib.request.Request(f'{SLACK}/{method}?{q}',
                                 headers={'Authorization': f'Bearer {TOKEN}'})
    d = json.load(urllib.request.urlopen(req, timeout=30))
    if not d.get('ok'):
        raise RuntimeError(f'{method}: {d.get("error")}')
    return d


import urllib.parse  # noqa: E402


def collect():
    oldest = time.time() - DAYS * 86400
    corpus = []
    for ch in CHANNELS:
        hist = slack('conversations.history', channel=ch, oldest=oldest, limit=200)
        for m in hist.get('messages', []):
            text = m.get('text', '')
            if NOISE.search(text):
                continue
            entry = {'ts': m['ts'], 'user': m.get('user') or m.get('username', '?'),
                     'text': text[:4000]}
            if m.get('reply_count'):
                reps = slack('conversations.replies', channel=ch, ts=m['ts'], limit=50)
                entry['replies'] = [{'user': r.get('user', '?'), 'text': r.get('text', '')[:2000]}
                                    for r in reps.get('messages', [])[1:]]
            corpus.append(entry)
    return corpus


PROMPT = """You are the AI journalist for INFONET lab (GIST, Prof. Heung-No Lee).
Below is the last {days} days of the lab's internal Slack. Select 0-2 stories that
are NEWSWORTHY AND SAFE FOR THE PUBLIC LAB HOMEPAGE, then write each as an article.

STRICT PRIVACY RULES — exclude entirely:
- personal matters, grades, individual schedules, names in negative context
- internal strategy: funding applications, proposal plans, competitive analyses
- unpublished patentable ideas or internal product internals
  (e.g. SaeGyeol AI, AutoSQT, PrivateRouter internals — the public NAME may be
  mentioned, never the mechanism)
- anything a competitor or evaluator could exploit
If nothing qualifies, return an empty list. Fewer, better stories beat more.

Good stories: paper presentations / journal club (papers, links, insights),
published results, demos, course launches, open-source releases, public talks.

Return ONLY a JSON array; each item:
{{"filename": "YYYY-MM-DD-slug.md",
  "frontmatter": {{"title": str, "date": "YYYY-MM-DD",
    "author": "INFONET AI Reporter",
    "category": "research|web3|ai|lab|biz|education",
    "summary": str (<=180 chars),
    "source": "INFONET Slack, week of {week}"}},
  "body": str  // markdown, 150-300 words, factual, cite links verbatim, end with:
  // *This article was drafted by the AI journalist from the lab's Slack discussion
  // and approved by a human editor.*
}}

SLACK CORPUS:
{corpus}
"""


def write_articles(corpus):
    body = json.dumps({
        'model': MODEL, 'max_tokens': 4000,
        'messages': [{'role': 'user', 'content': PROMPT.format(
            days=DAYS, week=datetime.date.today().isoformat(),
            corpus=json.dumps(corpus, ensure_ascii=False)[:150000])}],
    }).encode()
    req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=body,
        headers={'x-api-key': os.environ['ANTHROPIC_API_KEY'],
                 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
    resp = json.load(urllib.request.urlopen(req, timeout=180))
    text = resp['content'][0]['text']
    articles = json.loads(re.search(r'\[.*\]', text, re.S).group(0))
    out = []
    for a in articles:
        p = ROOT / 'src/content/news' / a['filename']
        with open(p, 'w') as f:
            f.write('---\n')
            for k, v in a['frontmatter'].items():
                f.write(f'{k}: {json.dumps(v, ensure_ascii=False)}\n')
            f.write('---\n\n' + a['body'].strip() + '\n')
        out.append(str(p.relative_to(ROOT)))
    return out


def open_pr(files):
    branch = 'journalist/' + datetime.date.today().isoformat()
    run = lambda *c: subprocess.run(c, cwd=ROOT, check=True)
    run('git', 'checkout', '-b', branch)
    run('git', 'add', *files)
    run('git', '-c', 'user.name=INFONET AI Journalist',
        '-c', 'user.email=journalist@heungno.net',
        'commit', '-m', f'AI journalist: {len(files)} article(s), week of {datetime.date.today()}')
    run('git', 'push', 'origin', branch)
    subprocess.run(['gh', 'pr', 'create', '--fill', '--base', 'main',
                    '--title', f'📰 AI journalist — week of {datetime.date.today()}',
                    '--body', 'Articles drafted from Slack. Review for accuracy and '
                              'privacy, then merge to publish.\n\nFiles:\n' +
                              '\n'.join(f'- {f}' for f in files)],
                   cwd=ROOT, check=True)


if __name__ == '__main__':
    corpus = collect()
    print(f'collected {len(corpus)} messages')
    if not corpus:
        sys.exit(0)
    files = write_articles(corpus)
    print('articles:', files)
    if files:
        open_pr(files)
