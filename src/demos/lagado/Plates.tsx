/**
 * Lagado's three plates under the title: little cream cards fanned like a hand, dealt in
 * on load, draggable inside their own area (they never cover text or buttons), tap to open.
 * Look and texts chosen with the author on 2026-11-11 ("Split" plates, prototype v28).
 */
import { useEffect, useRef, useState } from "react";
import { clampToArea, fanPositions } from "./plates-layout";
import "./plates.css";

interface Props {
  images: { engine: string; swift: string; engineBig: string; swiftBig: string };
}

type Key = "specimen" | "portrait" | "figures";
interface Plate {
  key: Key;
  kind: string;
  num: string;
  caption: string;
  plate: string;
  tilt: number;
}

const PLATES: Plate[] = [
  { key: "specimen", kind: "Specimen", num: "I", caption: "The Engine", plate: "Pl. I", tilt: -7 },
  { key: "portrait", kind: "Portrait", num: "II", caption: "The Pitch", plate: "Pl. II", tilt: -1 },
  { key: "figures", kind: "Figures", num: "III", caption: "Spec sheet", plate: "Pl. III", tilt: 6 },
];

const SPECS: [string, string][] = [
  ["Frame", "20 ft square"],
  ["Controls", "40 iron handles"],
  ["Team", "36 readers, 4 scribes"],
  ["Uptime", "6 hours a day"],
  ["Output", "Broken sentences, in large folio"],
  ["Roadmap", "500 more frames, if the publick would raise a fund"],
];

const ALT = {
  engine: "The Lagado engine: a square frame of word-blocks with handles all around.",
  swift: "Portrait of Jonathan Swift, after an ink drawing by Amélie Derome.",
};

export default function Plates({ images }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Key | null>(null);
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
            { transform: `translate(${c.dataset.x}px, ${c.dataset.y}px) rotate(${PLATES[i].tilt}deg)`, opacity: 1 },
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
        if (tapped) setOpen(PLATES[i].key);
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
    return () => {
      observer.disconnect();
      cleanups.forEach((f) => f());
    };
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const picture = (p: Plate) =>
    p.key === "figures" ? (
      <span className="lp-table">
        {[["Frame", "20 ft"], ["Handles", "40"], ["Pupils", "40"], ["Genius", "0"]].map(([k, v]) => (
          <span key={k}>
            <span>{k}</span>
            <span>{v}</span>
          </span>
        ))}
      </span>
    ) : (
      <img
        src={p.key === "specimen" ? images.engine : images.swift}
        alt=""
        draggable={false}
        width={p.key === "specimen" ? 853 : 675}
        height={900}
      />
    );

  return (
    <>
      <div ref={areaRef} className={`lp-area${ready ? " is-ready" : ""}`} aria-label="Three plates: drag them around, tap one to read it.">
        {PLATES.map((p, i) => (
          <button
            key={p.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            type="button"
            className="lp-plate"
            style={{ "--r": `${p.tilt}deg`, zIndex: i + 1 } as React.CSSProperties}
            aria-label={`${p.caption}, plate ${p.num}: open`}
            onClick={(e) => e.detail === 0 && setOpen(p.key)}>
            <span className="lp-top">
              <span>{p.kind}</span>
              <span>1726</span>
            </span>
            <span className="lp-pic">
              <span className="lp-art">{picture(p)}</span>
              <span className="lp-num" aria-hidden="true">
                {p.num}
              </span>
            </span>
            <span className="lp-cap">
              <i>{p.caption}</i>
              <b>{p.plate}</b>
            </span>
          </button>
        ))}
      </div>
      <p className="lp-hint">Drag the plates · tap to read</p>

      <dialog ref={dialogRef} className="lp-dialog" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        <button type="button" className="lp-close" aria-label="Close" onClick={() => setOpen(null)}>
          ×
        </button>
        {open && (
          <>
            <p className="lp-label">
              <span>{PLATES.find((p) => p.key === open)!.plate}</span>
              <span>{PLATES.find((p) => p.key === open)!.kind}</span>
            </p>
            {open === "specimen" && (
              <>
                <img className="lp-big-pic" src={images.engineBig} alt={ALT.engine} draggable={false} width={853} height={900} loading="lazy" />
                <p className="lp-title">The Engine</p>
                <p className="lp-note">
                  A satirical machine from 1726 that writes books by shuffling words at random, three centuries before AI wrote its first
                  sentence. Jonathan Swift dreamt it up to mock the scientists of his day. Turn the handles, read the lines, keep what makes
                  sense.
                </p>
                <p className="lp-note">
                  Jonathan Swift, <i>Gulliver's Travels</i> (1726)
                </p>
              </>
            )}
            {open === "portrait" && (
              <>
                <img className="lp-big-pic" src={images.swiftBig} alt={ALT.swift} draggable={false} width={675} height={900} loading="lazy" />
                <blockquote className="lp-quote">
                  …the most ignorant person… might write books… without the least assistance from genius or study.
                </blockquote>
                <p className="lp-note">
                  The professor of Lagado, in <i>Gulliver's Travels</i>. Portrait: Amélie Derome.
                </p>
              </>
            )}
            {open === "figures" && (
              <>
                <p className="lp-title">
                  Spec sheet <span className="lp-pill">In beta since 1726</span>
                </p>
                <ul className="lp-specs">
                  {SPECS.map(([k, v]) => (
                    <li key={k}>
                      <span>{k}</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
