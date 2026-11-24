// "The World Today" — entry program for make.fun's news-image-20261124 bounty.
//
// The picture itself is entry.png beside this file: a front page for Tuesday
// 24 November 2026 carrying five verified stories (Nvidia's CEO returns,
// Russian strikes on Kyiv, the Indonesia factory fire, Gomez quitting
// Congress, and the COP31 collapse). This program's one job is to deliver
// those exact bytes to /output/entry.png, so before it copies anything it
// checks the gate's own limits: the file must carry a PNG signature and be
// at most 1 MiB (1024 by 1024 pixels is a property of the stored image).
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1_048_576; // the gate's 1 MiB cap
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const image = readFileSync(new URL('./entry.png', import.meta.url));

if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB gate limit`);
}
if (!PNG_SIGNATURE.every((byte, i) => image[i] === byte)) {
  throw new Error('entry.png does not start with a PNG signature');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
writeFileSync(target, image);

// Read the delivered file back and compare it byte for byte with the
// repository image: the judge sees exactly the bytes in /output/entry.png,
// so a short or corrupted write must fail loudly here instead of silently
// handing the judge a different picture.
const delivered = readFileSync(target);
if (!delivered.equals(image)) {
  throw new Error('read-back mismatch: the delivered entry.png differs from the repository image');
}
