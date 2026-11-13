/**
 * An exhibit's three plates under the title: little cream cards fanned like a hand, dealt in
 * on load, draggable inside their own area (they never cover text or buttons), tap to open.
 * Look chosen with the author on 2026-11-11 for Lagado ("Split" plates, prototype v28); shared
 * with every exhibit since 2026-11-13 (her yes). Each exhibit's Hero.astro passes its own plates:
 * the face (kind, numeral, caption, a picture or a small table) and the opened plate as blocks.
 * Short texts may use *italics*.
 */
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { clampToArea, fanPositions } from "./plates-layout";
import "./plates.css";

export interface PlateImage {
  src: string;
  width: number;
  height: number;
}

/** One piece of an opened plate, shown in the order given. */
export type PlateBlock =
  | { image: PlateImage & { alt: string } }
  | { title: string; pill?: string }
  | { quote: string }
  | { note: string }
  | { specs: [string, string][] }
  | { timeline: { when: string; who?: string; text: string; source?: string }[] };

export interface Plate {
  /** "Specimen", "Portrait", "Figures": top left of the card and of the opened plate. */
  kind: string;
  /** The big numeral on the card: "I", "II", "III". */
  num: string;
  caption: string;
  /** "Pl. I": bottom right of the card, top left of the opened plate. */
  label: string;
  /** Tilt of the card in the fan, in degrees. */
  tilt: number;
  /** The card's picture, or a small table of figures. */
  face: { image: PlateImage } | { table: [string, string][] };
  open: PlateBlock[];
}

interface Props {
  plates: Plate[];
  /** Top right of every card: the exhibit's year. */
  year: string;
}

/** "Jonathan Swift, *Gulliver's Travels* (1726)" → text with <i>…</i>. */
function inline(text: string): ReactNode {
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <i key={i}>{part}</i> : <Fragment key={i}>{part}</Fragment>));
}

function Block({ block }: { block: PlateBlock }) {
  if ("image" in block) {
    const { src, width, height, alt } = block.image;
    return <img className="pl-big-pic" src={src} alt={alt} draggable={false} width={width} height={height} loading="lazy" />;
  }
  if ("title" in block) {
    return (
      <p className="pl-title">
        {block.title}
        {block.pill && (
          <>
            {" "}
            <span className="pl-pill">{block.pill}</span>
          </>
        )}
      </p>
    );
  }
  if ("quote" in block) return <blockquote className="pl-quote">{inline(block.quote)}</blockquote>;
  if ("note" in block) return <p className="pl-note">{inline(block.note)}</p>;
  if ("specs" in block) {
    return (
      <ul className="pl-specs">
        {block.specs.map(([k, v]) => (
          <li key={k}>
            <span>{k}</span>
            <span>{inline(v)}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol className="pl-timeline">
      {block.timeline.map((t) => (
        <li key={t.when + t.text}>
          <span>{t.when}</span>
          <span>
            {t.who && <b>{t.who} </b>}
            {inline(t.text)}
            {t.source && <small>{inline(t.source)}</small>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function Plates({ plates, year }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fingerRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  // Place the cards (in a fan, or where the visitor left them), and deal them in the first time.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const cards = cardRefs.current.filter((c): c is HTMLButtonElement => Boolean(c));
    const size = () => ({ width: area.clientWidth, height: area.clientHeight });
    const put = (c: HTMLButtonElement, x: number, y: number) => {
      const p = clampToArea({ x, y }, size(), { width: c.offsetWidth, height: c.offsetHeight });
      c.dataset.x = String(p.x);
      c.dataset.y = String(p.y);
      c.style.setProperty("--x", `${p.x}px`);
      c.style.setProperty("--y", `${p.y}px`);
    };
    const layout = () => {
      // Start 14px in, so the first card's tilted corner lines up with the title.
      const fan = fanPositions(size(), { width: cards[0].offsetWidth, height: cards[0].offsetHeight }, cards.length, 14, matchMedia("(min-width: 960px)").matches);
      cards.forEach((c, i) => (c.dataset.moved ? put(c, Number(c.dataset.x), Number(c.dataset.y)) : put(c, fan[i].x, fan[i].y)));
    };
    layout();
    setReady(true);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((c, i) =>
        c.animate(
          [
            { transform: `translate(0px, ${area.clientHeight * 0.35}px) rotate(0deg)`, opacity: 0 },
            { transform: `translate(${c.dataset.x}px, ${c.dataset.y}px) rotate(${plates[i].tilt}deg)`, opacity: 1 },
          ],
          { duration: 650, delay: 250 + i * 140, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" },
        ),
      );
    }
    const observer = new ResizeObserver(layout);
    observer.observe(area);

    // Drag inside the area; a press without movement is a tap, which opens the plate.
    let top = cards.length;
    const cleanups = cards.map((c, i) => {
      let start: { px: number; py: number; x: number; y: number; moved: boolean } | null = null;
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        start = { px: e.clientX, py: e.clientY, x: Number(c.dataset.x), y: Number(c.dataset.y), moved: false };
        c.setPointerCapture(e.pointerId);
        c.style.zIndex = String(++top);
      };
      const move = (e: PointerEvent) => {
        if (!start) return;
        const dx = e.clientX - start.px;
        const dy = e.clientY - start.py;
        if (!start.moved && Math.hypot(dx, dy) < 6) return;
        start.moved = true;
        c.classList.add("is-dragging");
        c.dataset.moved = "1";
        put(c, start.x + dx, start.y + dy);
      };
      const up = () => {
        if (!start) return;
        const tapped = !start.moved;
        start = null;
        c.classList.remove("is-dragging");
        if (tapped) setOpen(i);
      };
      const cancel = () => {
        start = null;
        c.classList.remove("is-dragging");
      };
      c.addEventListener("pointerdown", down);
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerup", up);
      c.addEventListener("pointercancel", cancel);
      return () => {
        c.removeEventListener("pointerdown", down);
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerup", up);
        c.removeEventListener("pointercancel", cancel);
      };
    });
    // The ghost finger (chosen by the author from a prototype, 2026-11-13: visitors didn't see the
    // plates could be dragged and tapped). Once per visit, just after the deal, a faint finger
    // presses the front plate, drags it a little, lets it go back, then taps it. Any touch on the page stops it;
    // nothing with reduced motion. The plate's resting place is never changed.
    const finger = fingerRef.current;
    const ripple = rippleRef.current;
    const front = cards[cards.length - 1];
    const KEY = "cabinet-plates-demo";
    const seen = () => {
      try {
        return sessionStorage.getItem(KEY) === "1";
      } catch {
        return false;
      }
    };
    let demoOn = false;
    let stopped = false;
    const show = (c: HTMLButtonElement, x: number, y: number) => {
      c.style.setProperty("--x", `${x}px`);
      c.style.setProperty("--y", `${y}px`);
    };
    const stopDemo = () => {
      stopped = true;
      if (!demoOn) return;
      demoOn = false;
      finger?.getAnimations().forEach((a) => a.cancel());
      if (finger) finger.style.opacity = "0";
      front.classList.remove("pl-ease");
      show(front, Number(front.dataset.x), Number(front.dataset.y));
    };
    const to = (x: number, y: number, scale: number, opacity: number, ms: number) =>
      finger!.animate([{}, { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity }], { duration: ms, fill: "forwards", easing: "cubic-bezier(.3,.7,.3,1)" }).finished.then(() => !stopped);
    const runDemo = async () => {
      if (!finger || !ripple || stopped || seen() || front.dataset.moved) return;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* the demo simply plays again on the next page */
      }
      demoOn = true;
      const sx = Number(front.dataset.x);
      const sy = Number(front.dataset.y);
      const cx = sx + front.offsetWidth * 0.5;
      const cy = sy + front.offsetHeight * 0.45;
      finger.style.transform = `translate(${cx + 40}px, ${cy + 60}px) scale(1.1)`;
      front.style.zIndex = String(++top);
      if (!(await to(cx, cy, 1.1, 0.95, 260))) return;
      if (!(await to(cx, cy, 0.85, 0.95, 120))) return;
      front.classList.add("pl-ease");
      show(front, sx - 70, sy + 26);
      if (!(await to(cx - 70, cy + 26, 0.85, 0.95, 450))) return;
      show(front, sx, sy);
      if (!(await to(cx - 70, cy + 26, 1.1, 0.6, 160))) return;
      if (!(await to(cx, cy, 1.05, 0.95, 320))) return;
      if (!(await to(cx, cy, 0.85, 0.95, 110))) return;
      ripple.style.setProperty("--rx", `${cx}px`);
      ripple.style.setProperty("--ry", `${cy}px`);
      ripple.classList.remove("is-on");
      void ripple.offsetWidth;
      ripple.classList.add("is-on");
      await to(cx, cy, 1.1, 0, 380);
      front.classList.remove("pl-ease");
      demoOn = false;
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const demoTimer = reduce ? 0 : window.setTimeout(runDemo, 250 + (cards.length - 1) * 140 + 650 + 800);
    const onTouch = () => stopDemo();
    window.addEventListener("pointerdown", onTouch, true);

    return () => {
      observer.disconnect();
      cleanups.forEach((f) => f());
      window.clearTimeout(demoTimer);
      window.removeEventListener("pointerdown", onTouch, true);
      stopDemo();
    };
  }, [plates]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const shown = open === null ? null : plates[open];

  return (
    <>
      <div ref={areaRef} className={`pl-area${ready ? " is-ready" : ""}`} aria-label="Three plates: drag them around, tap one to read it.">
        {plates.map((p, i) => (
          <button
            key={p.label}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            type="button"
            className="pl-plate"
            style={{ "--r": `${p.tilt}deg`, zIndex: i + 1 } as React.CSSProperties}
            aria-label={`${p.caption}, plate ${p.num}: open`}
            onClick={(e) => e.detail === 0 && setOpen(i)}>
            <span className="pl-top">
              <span>{p.kind}</span>
              <span>{year}</span>
            </span>
            <span className="pl-pic">
              <span className="pl-art">
                {"table" in p.face ? (
                  <span className="pl-table">
                    {p.face.table.map(([k, v]) => (
                      <span key={k}>
                        <span>{k}</span>
                        <span>{v}</span>
                      </span>
                    ))}
                  </span>
                ) : (
                  <img src={p.face.image.src} alt="" draggable={false} width={p.face.image.width} height={p.face.image.height} />
                )}
              </span>
              <span className="pl-num" aria-hidden="true">
                {p.num}
              </span>
            </span>
            <span className="pl-cap">
              <i>{p.caption}</i>
              <b>{p.label}</b>
            </span>
          </button>
        ))}
        <span ref={fingerRef} className="pl-finger" aria-hidden="true" />
        <span ref={rippleRef} className="pl-ripple" aria-hidden="true" />
      </div>
      <p className="pl-hint">Drag the plates · tap to read</p>

      <dialog ref={dialogRef} className="pl-dialog" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        <button type="button" className="pl-close" aria-label="Close" onClick={() => setOpen(null)}>
          ×
        </button>
        {shown && (
          <>
            <p className="pl-label">
              <span>{shown.label}</span>
              <span>{shown.kind}</span>
            </p>
            {shown.open.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </>
        )}
      </dialog>
    </>
  );
}
