// Llull's essay engravings, in black and white like Lagado's line engravings (author, 2026-11-13).
// 1517 figures: cropped to the figure; a pixel is ink only if all three channels are dark, so the
// hand-colouring drops out and only the printed lines stay, black on white.
// Breviculum (a painted miniature): black and white with strong contrast; the reproduction's modern
// numerals ("i ii iii iv v", "Nota") covered with the parchment just above them.
const sharp = require(require("path").join(process.argv[3], "node_modules/sharp"));
const [,, D, repo] = process.argv;
const out = `${repo}/src/content/exhibits/llull/images`;
async function lines(buf, lo, hi) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height, g = Buffer.alloc(n);
  for (let i = 0; i < n; i++) {
    const L = Math.max(data[i * info.channels], data[i * info.channels + 1], data[i * info.channels + 2]);
    g[i] = Math.round(255 * Math.min(1, Math.max(0, (L - lo) / (hi - lo))));
  }
  return sharp(g, { raw: { width: info.width, height: info.height, channels: 1 } });
}
(async () => {
  const jobs = [
    ["n33", "prima-figura", { left: 170, top: 670, width: 1870, height: 2010 }],
    ["n35", "secunda-figura", { left: 330, top: 320, width: 1756, height: 1960 }],
    ["n38", "tertia-figura", { left: 110, top: 150, width: 1720, height: 1625 }],
  ];
  for (const [src, name, crop] of jobs) {
    const buf = await sharp(`${D}/dl2/${src}.jpg`).extract(crop).toBuffer();
    await (await lines(buf, 90, 165)).resize(1200).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${name}.jpg`);
  }
  const b = `${D}/dl2/brev.jpg`;
  const strip = await sharp(b).extract({ left: 100, top: 814, width: 460, height: 22 }).toBuffer();
  const tiles = [836, 858, 880, 902, 922].map((top) => ({ input: strip, left: 100, top }));
  const patched = await sharp(b).composite(tiles).toBuffer();
  await sharp(patched).grayscale().normalise({ lower: 2, upper: 92 }).linear(1.25, -30).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/breviculum.jpg`);
})();
