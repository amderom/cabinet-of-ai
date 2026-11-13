// Llull's essay engravings: cropped to the figure, kept in colour (as Lagado's Grandville scans).
const sharp = require(require("path").join(process.argv[3], "node_modules/sharp"));
const [,, D, repo] = process.argv;
const out = `${repo}/src/content/exhibits/llull/images`;
(async () => {
  const jobs = [
    ["n33", "prima-figura", { left: 170, top: 670, width: 1870, height: 2010 }],
    ["n35", "secunda-figura", { left: 330, top: 320, width: 1756, height: 1960 }],
    ["n38", "tertia-figura", { left: 110, top: 150, width: 1720, height: 1625 }],
  ];
  for (const [src, name, crop] of jobs)
    await sharp(`${D}/dl2/${src}.jpg`).extract(crop).resize(1200).jpeg({ quality: 80, mozjpeg: true }).toFile(`${out}/${name}.jpg`);
  // Breviculum: the reproduction's modern numerals ("i ii iii iv v", "Nota") covered with the parchment just above them.
  const b = `${D}/dl2/brev.jpg`;
  // Clean parchment strip between the ground line and the numerals, tiled over them (x 95–560, y 838–942).
  const strip = await sharp(b).extract({ left: 100, top: 814, width: 460, height: 22 }).toBuffer();
  const tiles = [836, 858, 880, 902, 922].map((top) => ({ input: strip, left: 100, top }));
  await sharp(b).composite(tiles).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/breviculum.jpg`);
})();
