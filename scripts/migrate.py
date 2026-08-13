#!/usr/bin/env python3
"""
WordPress export -> Astro content migration for heungno.net.

Input : WordPress eXtended RSS export (cleaned of control chars)
Output: src/data/publications.json          (structured publication archive)
        src/content/news/wp-*.md            (all published posts as articles)
        src/archive-html/<slug>.html        (key static pages, cleaned HTML)

Do not hand-edit generated files; fix this generator and re-run:
    python3 scripts/migrate.py <export.xml>
"""
import sys, os, re, json, html, urllib.parse
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from markdownify import markdownify as md

NS = {'wp': 'http://wordpress.org/export/1.2/',
      'content': 'http://purl.org/rss/1.0/modules/content/',
      'dc': 'http://purl.org/dc/elements/1.1/'}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CATEGORY_MAP = {
    'artificial-intelligence': 'ai', 'blockchain': 'web3', 'journal-club': 'research',
    'research': 'research', 'course': 'education', 'laboratory-life': 'lab',
    'conference-notice': 'lab', 'blog': 'lab', 'news': 'lab', 'careers': 'lab',
    'about': 'lab', 'uncategorized': 'lab', 'all-categord': 'lab',
}
CATEGORY_PRIORITY = ['ai', 'web3', 'research', 'education', 'biz', 'lab']

PUB_PAGES = {  # post_id -> (output key, {summary heading -> section key})
    '27917': ('international', {'Journal Papers (International)': 'journal',
                                'Conference/Workshop': 'conference',
                                'International Patent Applications/Patent Disclosures': 'patents'}),
    '27958': ('domestic', {'Journal Papers': 'journal', 'Conference/Workshop': 'conference',
                           'Patent Applications/Patent Disclosures': 'patents',
                           'Magazine Articles': 'magazine'}),
    '27968': ('dissertations', {"Ph.D. Dissertations": 'phd', "Master's Theses": 'ms',
                                "Bachelor's Theses": 'bs', 'Open Proposal': 'proposal',
                                'Books/Book Chapters': 'books', 'Technical Reports': 'reports'}),
}

ARCHIVE_PAGES = {  # post_id -> slug
    '28002': 'professor', '27999': 'professor-kor', '28054': 'members', '28125': 'alumni',
    '27977': 'lectures', '1859': 'awards', '28728': 'projects-wp', '30993': 'upcoming-projects-wp',
    '27817': 'courses-wp', '1698': 'media',
}


def clean_wp_html(raw):
    """Remove wp block comments; return soup."""
    raw = re.sub(r'<!--\s*/?wp:[^>]*-->', '', raw or '')
    return BeautifulSoup(raw, 'html.parser')


def li_entry(li):
    text = ' '.join(li.get_text(' ', strip=True).split())
    text = re.sub(r'^\s*\d+\.\s*', '', text)
    links = []
    for a in li.find_all('a', href=True):
        label = ' '.join(a.get_text(' ', strip=True).split()) or a['href']
        links.append({'label': label[:80], 'url': a['href']})
    m = re.findall(r'\b(19[89]\d|20[0-4]\d)\b', text)
    year = int(m[-1]) if m else None
    doi = None
    dm = re.search(r'\b10\.\d{4,9}/[^\s,"\')]+', text)
    if dm:
        doi = dm.group(0).rstrip('.')
    return {'text': text, 'year': year, 'doi': doi, 'links': links}


def migrate_publications(items):
    out = {}
    for pid, (key, sections) in PUB_PAGES.items():
        if pid not in items:
            continue
        soup = clean_wp_html(items[pid].findtext('content:encoded', namespaces=NS))
        out[key] = {}
        for det in soup.find_all('details'):
            summ = det.find('summary')
            heading = summ.get_text(strip=True) if summ else ''
            skey = sections.get(heading)
            if not skey:
                continue
            entries = [li_entry(li) for li in det.find_all('li')]
            # ol is "reversed": first entry has the highest number
            n = len(entries)
            for i, e in enumerate(entries):
                e['n'] = n - i
            out[key][skey] = entries
    path = os.path.join(ROOT, 'src/data/publications.json')
    json.dump(out, open(path, 'w'), ensure_ascii=False, indent=1)
    total = sum(len(v) for cat in out.values() for v in cat.values())
    print(f'publications.json: {total} entries')


def post_slug(item):
    name = urllib.parse.unquote(item.findtext('wp:post_name', namespaces=NS) or '')
    if not re.fullmatch(r'[A-Za-z0-9-]{3,60}', name or ''):
        name = 'post-' + item.findtext('wp:post_id', namespaces=NS)
    return name.lower()


def map_category(item):
    cats = [c.get('nicename') for c in item.findall('category') if c.get('domain') == 'category']
    mapped = {CATEGORY_MAP.get(c, 'lab') for c in cats}
    for c in CATEGORY_PRIORITY:
        if c in mapped:
            return c
    return 'lab'


def migrate_posts(items_list):
    outdir = os.path.join(ROOT, 'src/content/news')
    os.makedirs(outdir, exist_ok=True)
    count = 0
    for item in items_list:
        if item.findtext('wp:post_type', namespaces=NS) != 'post':
            continue
        if item.findtext('wp:status', namespaces=NS) != 'publish':
            continue
        title = (item.findtext('title') or 'Untitled').strip()
        date = item.findtext('wp:post_date', namespaces=NS)[:10]
        author = (item.findtext('dc:creator', namespaces=NS) or 'INFONET').strip()
        soup = clean_wp_html(item.findtext('content:encoded', namespaces=NS))
        body = md(str(soup), heading_style='ATX', strip=['span']).strip()
        body = re.sub(r'\n{3,}', '\n\n', body)
        plain = ' '.join(soup.get_text(' ', strip=True).split())
        summary = (plain[:180] + '…') if len(plain) > 180 else (plain or title)
        fm = {
            'title': title, 'date': date, 'author': author,
            'category': map_category(item), 'summary': summary,
            'source': 'heungno.net WordPress archive',
        }
        fname = f'wp-{date}-{post_slug(item)}.md'
        with open(os.path.join(outdir, fname), 'w') as f:
            f.write('---\n')
            for k, v in fm.items():
                f.write(f'{k}: {json.dumps(v, ensure_ascii=False)}\n')
            f.write('---\n\n')
            f.write(body + '\n')
        count += 1
    print(f'news posts: {count} migrated')


def migrate_archive_pages(items):
    outdir = os.path.join(ROOT, 'src/archive-html')
    os.makedirs(outdir, exist_ok=True)
    meta = {}
    for pid, slug in ARCHIVE_PAGES.items():
        if pid not in items:
            continue
        item = items[pid]
        soup = clean_wp_html(item.findtext('content:encoded', namespaces=NS))
        title = (item.findtext('title') or slug).strip()
        open(os.path.join(outdir, f'{slug}.html'), 'w').write(str(soup))
        meta[slug] = {'title': title, 'wp_id': pid}
    json.dump(meta, open(os.path.join(outdir, '_meta.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'archive pages: {len(meta)}')


def main():
    src = sys.argv[1]
    raw = open(src, 'rb').read().decode('utf-8', errors='replace')
    raw = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)
    channel = ET.fromstring(raw).find('channel')
    items_list = channel.findall('item')
    items = {i.findtext('wp:post_id', namespaces=NS): i for i in items_list}
    migrate_publications(items)
    migrate_posts(items_list)
    migrate_archive_pages(items)


if __name__ == '__main__':
    main()
