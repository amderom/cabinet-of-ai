/**
 * The Lagado frame and its folio: the playable part of the demo page ("Signal" look,
 * chosen by the author on 2026-11-11 from a clickable prototype).
 * Rules live in engine.ts and folio.ts; this file only draws and reacts.
 *
 * Desktop shows the frame as a square (one column per grammatical place, a crank on
 * each column and each row). A phone shows it on its side (one row per place, 3 words,
 * a crank per place). Both layouts are rendered and CSS shows the one that fits, so the
 * server and the browser always agree.
 *
 * Smoothness (measured with the author, see the journal): only turned words animate;
 * the scramble plays on a separate layer over each word, so no word changes width and
 * nothing around it moves; one shared animation loop; the background lines and the
 * thread between picked words are drawn together on one canvas, about 30 times a
 * second, and paused when the machine is off screen.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createFrame, goodCombination, pick, seededRandom, sentence, shake, turnPlace, turnRow, type Frame } from "./engine";
import { addLine, editLine, loadFolio, newestFirst, removeLines, saveFolio, shareText, type Line } from "./folio";
import { PLACES } from "./words";
import "./machine.css";

const ROWS = 6; // desktop square
const PHONE_ROWS = 3; // words per place on a phone
const PHONE = "(max-width: 759px)";
// The first frame is the same for every visitor (so the page doesn't change on load); cranks are random.
const FIRST_FRAME = createFrame(ROWS, seededRandom(1726));

const random = () => Math.random();
const noBreak = (text: string) => text.replace(/-/g, "‑");
const plain = (text: string) => text.replace(/‑/g, "-");
const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));
const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
const prefersReducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One turn of a crank (or a shake): which blocks changed, and which crank to spin. */
interface Turn {
  cells: string[];
  crank: string;
  n: number;
}

export default function Machine() {
  const [frame, setFrame] = useState<Frame>(FIRST_FRAME);
  const [turn, setTurn] = useState<Turn>({ cells: [], crank: "", n: 0 });
  const [folio, setFolio] = useState<Line[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; undo?: Line[] } | null>(null);
  const [canShare, setCanShare] = useState(false);
  // The folio is saved only once the saved one has been read, so it is never overwritten by an empty one.
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threadRef = useRef<[number, number][]>([]);
  const redraw = useSignalField(canvasRef, threadRef);

  useEffect(() => {
    setFolio(loadFolio(storage()));
    setLoaded(true);
    setCanShare(typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches);
    // On a phone only the first rows show: keep every pick on a visible word.
    const phone = matchMedia(PHONE);
    const clamp = () => phone.matches && setFrame((f) => ({ ...f, picks: f.picks.map((r) => (r < PHONE_ROWS ? r : 0)) }));
    clamp();
    phone.addEventListener("change", clamp);
    return () => phone.removeEventListener("change", clamp);
  }, []);

  useEffect(() => {
    if (loaded) saveFolio(storage(), folio);
  }, [folio, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // Fit the phone rows, then place the thread through the picked words. Runs after every
  // change of words or picks, and whenever the frame changes size (fonts, rotation).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layout = () => {
      fitPhoneRows(root);
      threadRef.current = threadPoints(root, canvasRef.current);
      redraw();
    };
    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(root);
    document.fonts?.ready.then(layout);
    return () => observer.disconnect();
  }, [frame, redraw]);

  // After a turn: scramble the turned words that are on screen and spin the crank.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || turn.n === 0 || prefersReducedMotion()) return;
    for (const key of turn.cells) {
      root.querySelectorAll<HTMLElement>(`[data-cell="${key}"]`).forEach((el) => el.offsetParent && scramble(el));
    }
    root.querySelectorAll<HTMLElement>(`[data-crank="${turn.crank}"]`).forEach((k) => {
      k.classList.remove("is-turning");
      void k.offsetWidth; // restart the spin
      k.classList.add("is-turning");
    });
  }, [turn]);

  function apply(next: Frame, crank: string) {
    const cells: string[] = [];
    next.rows.forEach((row, r) => row.forEach((w, p) => w !== frame.rows[r][p] && cells.push(`${r}-${p}`)));
    setFrame(next);
    setTurn((t) => ({ cells, crank, n: t.n + 1 }));
  }

  const words = sentence(frame);
  const combination = goodCombination(words);

  function keep() {
    const id = newId();
    setFolio((f) => addLine(f, words, id));
    setFresh(id);
  }
  function remove(ids: string[], message: string) {
    setToast({ message, undo: folio });
    setFolio((f) => removeLines(f, ids));
  }
  async function share(lines: string[], message: string) {
    const text = shareText(lines, location.origin + location.pathname);
    if (canShare && lines.length === 1) {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message });
    } catch {
      setToast({ message: "Your browser refused to copy. Select the text by hand." });
    }
  }

  const word = (r: number, p: number) => (
    <button
      key={`${r}-${p}`}
      type="button"
      className="lagado-word"
      data-cell={`${r}-${p}`}
      aria-pressed={frame.picks[p] === r}
      onClick={() => setFrame((f) => pick(f, p, r))}>
      <span className="lagado-word-text">{noBreak(frame.rows[r][p])}</span>
      <span className="lagado-word-scramble" aria-hidden="true" />
    </button>
  );
  const crank = (id: string, label: string, onTurn: () => Frame) => (
    <button key={id} type="button" className="lagado-crank" data-crank={id} aria-label={label} title={label} onClick={() => apply(onTurn(), id)}>
      <TurnIcon />
    </button>
  );
  const placeCrank = (p: number, where: string) =>
    crank(`${where}p${p}`, `Turn the ${PLACES[p].name.toLowerCase()} ${where === "d" ? "column" : "row"}`, () => turnPlace(frame, p, random));

  return (
    <div className="lagado">
      <p className="lagado-intro">
        <span className="lagado-desk">Each column holds one kind of word. Turn a column or a row to flip its words. Pick one word per column.</span>
        <span className="lagado-phone">Each row holds one kind of word. Turn a row to flip its words. Pick one word per row.</span>
      </p>

      <div className="lagado-machine" ref={rootRef} role="group" aria-label="The word frame">
        <canvas className="lagado-field" ref={canvasRef} aria-hidden="true" />

        {/* Desktop: the square. */}
        <div className="lagado-square lagado-desk">
          <span />
          {PLACES.map((place, p) => (
            <div key={p} className="lagado-colhead">
              <span className="label">{place.name}</span>
              {placeCrank(p, "d")}
            </div>
          ))}
          {frame.rows.map((_, r) => [crank(`dr${r}`, `Turn row ${r + 1}`, () => turnRow(frame, r, random)), ...PLACES.map((_, p) => word(r, p))])}
        </div>

        {/* Phone: the same frame on its side. */}
        <div className="lagado-phone">
          {PLACES.map((place, p) => (
            <div key={p} className="lagado-place">
              <span className="label">{place.name}</span>
              <div className="lagado-words">{frame.rows.slice(0, PHONE_ROWS).map((_, r) => word(r, p))}</div>
              {placeCrank(p, "p")}
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="lagado-btn" onClick={() => apply(shake(frame, random), "shake")}>
        Shake the frame
      </button>

      <section className="lagado-folio" aria-label="Folio">
        <div className="lagado-draft">
          <p aria-live="polite">{noBreak(words.join(" "))}</p>
          <button type="button" className="lagado-btn is-primary" onClick={keep}>
            Keep
          </button>
        </div>
        <p className="lagado-combination label" aria-live="polite">
          {combination?.kind === "project" && <>Swift's own project: {combination.name}</>}
          {combination?.kind === "field" && <>The students take note: two nouns of {combination.field.replace("-", " ")}</>}
        </p>

        {folio.length === 0 ? (
          <p className="lagado-empty">Kept lines land here. Edit them, share them, or throw them away.</p>
        ) : (
          <>
            <div className="lagado-folio-head label">
              <span>
                Folio · {folio.length} line{folio.length === 1 ? "" : "s"}
              </span>
              <span>Tap a line to edit it</span>
            </div>
            <ul className="lagado-lines">
              {newestFirst(folio).map((line) => (
                <li key={line.id} className={`lagado-line${line.id === fresh ? " is-new" : ""}`}>
                  <EditableText text={line.text} onSave={(text) => setFolio((f) => editLine(f, line.id, text))} />
                  <button
                    type="button"
                    className="lagado-icon"
                    aria-label={canShare ? "Share this line" : "Copy this line"}
                    title={canShare ? "Share" : "Copy"}
                    onClick={() => share([line.text], "Copied. Paste it anywhere.")}>
                    {canShare ? <ShareIcon /> : <CopyIcon />}
                  </button>
                  <button type="button" className="lagado-icon" aria-label="Delete this line" title="Delete" onClick={() => remove([line.id], "Line deleted.")}>
                    <DeleteIcon />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {folio.length > 0 && (
          <div className="lagado-tools">
            <button type="button" className="lagado-btn" onClick={() => share(folio.map((l) => l.text), "Folio copied.")}>
              Copy all
            </button>
            <button type="button" className="lagado-btn" onClick={() => remove(folio.map((l) => l.id), "Folio cleared.")}>
              Clear all
            </button>
          </div>
        )}
        <div className="lagado-toast" role="status">
          {toast && (
            <>
              <span>{toast.message}</span>
              {toast.undo && (
                <button
                  type="button"
                  onClick={() => {
                    setFolio(toast.undo!);
                    setToast(null);
                  }}>
                  Undo
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- The scramble: random letters settle into the word, left to right ----------

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const scrambling = new Map<HTMLElement, { word: string; start: number; last: number }>();
let scrambleFrame = 0;

/** Plays on the word's overlay; the real word stays underneath, hidden, holding the width. */
function scramble(el: HTMLElement) {
  const word = el.querySelector(".lagado-word-text")?.textContent ?? "";
  const overlay = el.querySelector<HTMLElement>(".lagado-word-scramble");
  // Random letters from the very first frame, so the word never blinks out.
  if (overlay) overlay.textContent = [...word].map((c) => (/[a-z]/i.test(c) ? LETTERS[(Math.random() * 26) | 0] : c)).join("");
  el.classList.add("is-scrambling");
  const now = performance.now();
  scrambling.set(el, { word, start: now, last: now });
  if (!scrambleFrame) scrambleFrame = requestAnimationFrame(scrambleTick);
}

function scrambleTick(now: number) {
  for (const [el, s] of scrambling) {
    const overlay = el.querySelector<HTMLElement>(".lagado-word-scramble");
    const revealed = Math.floor((now - s.start) / 56); // one more real letter every 56ms
    if (!overlay || !el.isConnected || revealed >= s.word.length) {
      el.classList.remove("is-scrambling");
      if (overlay) overlay.textContent = "";
      scrambling.delete(el);
    } else if (now - s.last > 28) {
      // new random letters every 28ms
      s.last = now;
      overlay.textContent = [...s.word].map((c, i) => (i < revealed || !/[a-z]/i.test(c) ? c : LETTERS[(Math.random() * 26) | 0])).join("");
    }
  }
  scrambleFrame = scrambling.size ? requestAnimationFrame(scrambleTick) : 0;
}

// ---------- Layout helpers ----------

/** Phone: a row of three long words steps down from 21px (17px at most) to stay on one line. */
function fitPhoneRows(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".lagado-phone .lagado-words").forEach((row) => {
    if (!row.offsetParent) return;
    let size = 21;
    row.style.setProperty("--fs", `${size}px`);
    while (row.scrollWidth > row.clientWidth + 0.5 && size > 17) {
      size -= 1;
      row.style.setProperty("--fs", `${size}px`);
    }
  });
}

/** The centre of each picked word on screen, in reading order, relative to the canvas. */
function threadPoints(root: HTMLElement, canvas: HTMLCanvasElement | null): [number, number][] {
  if (!canvas) return [];
  const box = canvas.getBoundingClientRect();
  return [...root.querySelectorAll<HTMLElement>('.lagado-word[aria-pressed="true"]')]
    .filter((el) => el.offsetParent)
    .sort((a, b) => Number(a.dataset.cell!.split("-")[1]) - Number(b.dataset.cell!.split("-")[1]))
    .map((el) => {
      const b = el.getBoundingClientRect();
      return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top];
    });
}

// ---------- The background: a slow field of thin lines, and the thread ----------

/**
 * Draws the field of short vertical lines (fading at the top and bottom) and the glowing
 * dashed thread through the picked words, on one canvas, about 30 times a second.
 * Paused when the machine is off screen or the tab is hidden; drawn once, still, when
 * the visitor asks for reduced motion. Returns a function that asks for a redraw.
 */
function useSignalField(canvasRef: RefObject<HTMLCanvasElement | null>, threadRef: RefObject<[number, number][]>) {
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = prefersReducedMotion();
    const accent = getComputedStyle(canvas).getPropertyValue("--color-accent").trim() || "#ff5f1f";
    let frameId = 0;
    let last = -Infinity;
    let visible = true;

    const paint = (t: number) => {
      const dpr = devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // The field: short vertical lines, brighter where a slow ripple passes.
      ctx.fillStyle = "rgb(244 236 223)";
      for (let x = 7; x < w; x += 14) {
        for (let y = 6; y < h; y += 22) {
          const edge = Math.min(1, y / 48, (h - y - 10) / 64);
          if (edge <= 0) continue;
          const ripple = reduced ? 0.3 : Math.max(0, Math.sin(Math.hypot(x - w / 2, (y - h / 2) * 1.4) / 38 - t / 900));
          ctx.globalAlpha = (0.05 + 0.13 * ripple) * edge;
          ctx.fillRect(x, y, 1, 10);
        }
      }

      // The thread: a soft orange glow and moving dashes at 40%, through each picked word.
      const pts = threadRef.current;
      if (pts.length > 1) {
        const line = () => {
          ctx.beginPath();
          pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        };
        ctx.strokeStyle = accent;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.07;
        ctx.lineWidth = 9;
        line();
        ctx.stroke();
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 4;
        line();
        ctx.stroke();
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = reduced ? 0 : -((t / 75) % 16);
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1.2;
        line();
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      frameId = 0;
      if (!visible || document.hidden) return;
      if (t - last >= 33) {
        last = t;
        paint(t);
      }
      if (!reduced) frameId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frameId) frameId = requestAnimationFrame(loop);
    };
    redrawRef.current = () => {
      last = -Infinity;
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVisibility = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canvasRef, threadRef]);

  // A stable function for callers; it always reaches the current loop.
  const [redraw] = useState(() => () => redrawRef.current());
  return redraw;
}

// ---------- Folio line ----------

/**
 * A kept line the visitor can edit like text. The browser owns its text while it is
 * edited (React never redraws inside it), so typing can't confuse the page. Browsers that
 * don't know plain-text editing (Firefox before 136) get ordinary editing instead.
 */
function EditableText({ text, onSave }: { text: string; onSave: (text: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      el.contentEditable = "plaintext-only";
    } catch {
      el.contentEditable = "true";
    }
    if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el) el.textContent = noBreak(text);
  }, [text]);
  return (
    <span
      ref={ref}
      className="lagado-line-text"
      role="textbox"
      aria-label="Kept line, editable"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => onSave(plain(e.currentTarget.textContent ?? "").trim() || text)}
    />
  );
}

// ---------- Icons ----------

const TurnIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v5h-5" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 15V3M8 7l4-4 4 4" />
    <path d="M7 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
