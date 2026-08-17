import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'dist-concierge/corpus.json');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(DIST, 'concierge-corpus.json');

async function main() {
  await mkdir(DIST, { recursive: true });
  await copyFile(SRC, OUT);
  const info = await stat(OUT);
  console.log(`Published Concierge corpus to ${OUT} (${info.size} bytes)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
