// Llull's images as ink (#111) on a transparent ground, and the figure as black on white for the texture.
// "Lightness" = the brightest channel, so coloured fills (red, green, ochre) count as paper and only ink stays.
const sharp = require(require("path").join(process.argv[3], "node_modules/sharp"));
const [,, D, repo] = process.argv;
// Flat-field: the paper's brightness estimated per 80px cell (its brightest pixel), cells of solid
// ink filled from their neighbours, then smoothed, so a photo's uneven light reads as one white.
function paper(L, w, h, cell = 80) {
  const gw = Math.ceil(w / cell), gh = Math.ceil(h / cell), g = new Float64Array(gw * gh);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const k = Math.floor(y / cell) * gw + Math.floor(x / cell); g[k] = Math.max(g[k], L[y * w + x]); }
  for (let pass = 0; pass < 20; pass++) for (let k = 0; k < g.length; k++) if (g[k] < 120) {
    const x = k % gw, y = Math.floor(k / gw); let sum = 0, n = 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < gw && yy < gh && g[yy * gw + xx] >= 120) { sum += g[yy * gw + xx]; n++; } }
    if (n) g[k] = sum / n;
  }
  const bg = new Float64Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const fx = Math.min(gw - 1.001, Math.max(0, x / cell - 0.5)), fy = Math.min(gh - 1.001, Math.max(0, y / cell - 0.5));
    const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0, x1 = Math.min(gw - 1, x0 + 1), y1 = Math.min(gh - 1, y0 + 1);
    bg[y * w + x] = (g[y0*gw+x0]*(1-tx)+g[y0*gw+x1]*tx)*(1-ty) + (g[y1*gw+x0]*(1-tx)+g[y1*gw+x1]*tx)*ty;
  }
  return bg;
}
async function ink(src, { crop, rotate, lo, hi, height, outInk, outWhite, flat, circle }) {
  let img = sharp(src);
  if (rotate) img = img.rotate();
  const buf = await img.toBuffer();
  let base = sharp(buf);
  if (crop) base = base.extract({ left: crop.left, top: crop.top, width: crop.width, height: crop.height });
  if (crop && crop.padTo) { const extra = Math.round(crop.width * crop.padTo) - crop.height; base = sharp(await base.extend({ top: Math.floor(extra / 2), bottom: Math.ceil(extra / 2), background: "#ffffff" }).toBuffer()); }
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height, a = Buffer.alloc(n), w = Buffer.alloc(n), Ls = new Float64Array(n);
  for (let i = 0; i < n; i++) Ls[i] = Math.max(data[i * info.channels], data[i * info.channels + 1], data[i * info.channels + 2]);
  const bg = flat ? paper(Ls, info.width, info.height) : null;
  for (let i = 0; i < n; i++) {
    let L = bg ? Math.min(255, (Ls[i] / Math.max(1, bg[i])) * 230) : Ls[i];
    // Outside the wheel (the figure only): paper.
    if (circle) { const x = i % info.width - info.width / 2, y = Math.floor(i / info.width) - info.height / 2; if (Math.hypot(x, y) > circle * info.width) L = 255; }
    const t = Math.min(1, Math.max(0, (hi - L) / (hi - lo)));
    a[i] = Math.round(t * 255); w[i] = 255 - a[i];
  }
  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) { rgba[i*4]=17; rgba[i*4+1]=17; rgba[i*4+2]=17; rgba[i*4+3]=a[i]; }
  const W = Math.round(height * info.width / info.height);
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).resize(W, height).png({ compressionLevel: 9 }).toFile(outInk);
  if (outWhite) await sharp(w, { raw: { width: info.width, height: info.height, channels: 1 } }).resize(W, height).png({ compressionLevel: 9 }).toFile(outWhite);
  console.log(outInk, W, height);
}
(async () => {
  // Fourth figure, scan n39 (2096 x 2947): the three wheels, cropped to Lagado's texture ratio 640:675.
  const cx = 1121, cy = 1467, side = 1720;
  const crop = { left: cx - side / 2, top: cy - side / 2, width: side, height: side, padTo: 675 / 640 };
  await ink(`${D}/dl/n39.jpg`, { crop, lo: 90, hi: 165, circle: 0.497, height: 900, outInk: `${D}/out/quarta-figura-ink.png`, outWhite: `${D}/out/quarta-figura.png` });
  await ink(`${repo}/docs/features/llull/sources/llull-drawing.jpg`, { rotate: true, crop: { left: 300, top: 650, width: 2450, height: 2580 }, lo: 110, hi: 172, flat: true, height: 900, outInk: `${D}/out/llull-ink.png` });
})();
