/**
 * Llull's Art, playable: "Ask the Art" (Orbit look, chosen by the author from a clickable
 * prototype, v7, 2026-11-13). One question at a time; the wheel draws the question's three
 * letters as a triangle; then the answer; then why, reason by reason, each ringing its letters.
 * The questions and their wording live in questions.ts (tied to the validated document by a
 * test); the alphabet in art.ts. This file only draws and reacts.
 *
 * Smoothness: one animation loop for the page, started once; the triangle follows the clock,
 * so a busy phone skips frames instead of stalling. With reduced motion nothing moves:
 * the wheel is drawn once per change and the answer appears at once.
 */
import { useEffect, useRef, useState } from "react";
import { ALPHABET, LETTERS, type Letter } from "./art";
import { QUESTIONS, type Question } from "./questions";
import "./machine.css";
import { play, registerSounds } from "../../sound/player";
import reasonM4a from "./sounds/reason.m4a?url";
import reasonWav from "./sounds/reason.wav?url";
import verdictM4a from "./sounds/verdict.m4a?url";
import verdictWav from "./sounds/verdict.wav?url";

// Two quiet sounds, chosen by the author by ear (2026-11-13; credited in exhibit.yaml): a soft
// click as each reason lights up, a singing-bowl strike when the answer lands. No sound on the
// tap itself (her choice). Downloaded only once sound is on; .wav is a fallback without AAC.
registerSounds({
  reason: { src: [reasonM4a, reasonWav], volume: 0.45 },
  verdict: { src: [verdictM4a, verdictWav], volume: 0.45 },
});

const TRIANGLE_MS = 1000;
const ANSWER_AT = 1100;
const WHY_AFTER = 700;
const REASON_MS = 900;

/** First question fixed (so the server and the browser agree); the rest shuffled on arrival, a 2026 one second. */
const FIRST = QUESTIONS.find((q) => q.id === "R1")!;
function order(random: () => number): Question[] {
  const shuffle = <T,>(a: T[]) => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const real = shuffle(QUESTIONS.filter((q) => q.kind === "llull" && q !== FIRST));
  const y2026 = shuffle(QUESTIONS.filter((q) => q.kind === "startup"));
  return [FIRST, y2026[0], real[0], real[1], y2026[1], real[2], real[3], y2026[2], real[4]];
}

/** Llull's own words inside a reason line (the curly-quoted part). */
const llullWords = (line: string) => (line.match(/“[^”]*”/g) ?? []).join(" ");
/** What a letter means in this question, short enough for a label on the wheel. */
const shortMeaning = (as: string) => as.split(/[;:(,]/)[0].replace(/^the /, "").trim();

type Phase = "idle" | "wheel" | "answer" | "why" | "done";

export default function Machine() {
  const [questions, setQuestions] = useState<Question[]>(() => order(() => 0));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0); // reasons shown
  const [canShare, setCanShare] = useState(false);
  const [toast, setToast] = useState("");
  const q = questions[index];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawState = useRef({ lit: [] as string[], focus: [] as string[], meaning: {} as Record<string, string>, triStart: 0 });
  const redrawRef = useRef<() => void>(() => {});
  const timers = useRef<number[]>([]);
  const reduce = useRef(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  // Phone only (stacked layout): the page follows the Art (wheel, then answer, then each reason)
  // until the visitor scrolls by hand. Asked by the author, 2026-11-13.
  const following = useRef(false);

  useEffect(() => {
    setQuestions(order(Math.random));
    setCanShare(typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches);
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // The wheel: one canvas, one loop.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const css = getComputedStyle(cv);
    const display = css.getPropertyValue("--wheel-display").trim() || "serif";
    const mono = css.getPropertyValue("--wheel-mono").trim() || "monospace";
    const accent = css.getPropertyValue("--wheel-accent").trim() || "#ff2d55";
    const t0 = performance.now();
    let S = 300;
    let pulled = 0;
    let raf = 0;

    const size = () => {
      S = cv.getBoundingClientRect().width || 300;
      const d = Math.min(devicePixelRatio || 1, 2);
      cv.width = S * d;
      cv.height = S * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const pt = (i: number, r: number) => {
      const a = ((i * 40 - 90) * Math.PI) / 180;
      return [S / 2 + r * Math.cos(a), S / 2 + r * Math.sin(a)] as const;
    };

    const draw = (now: number) => {
      const { lit, focus, meaning, triStart } = drawState.current;
      const t = (now - t0) / 1000;
      const prog = Math.max(0, Math.min(1, (now - triStart) / TRIANGLE_MS));
      const R = S * (S > 400 ? 0.35 : 0.28);
      let inkLeft = Infinity;
      ctx.clearRect(0, 0, S, S);
      // slow dotted orbits
      for (let k = 0; k < 3; k++) {
        ctx.save();
        ctx.translate(S / 2, S / 2);
        ctx.rotate((reduce.current ? 0 : t * (0.05 + k * 0.03)) * (k % 2 ? -1 : 1));
        ctx.setLineDash([2, 7]);
        ctx.strokeStyle = "rgba(244,236,223,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, R * (1.22 - k * 0.1), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // Llull's first figure: every letter joined to every other (36 lines)
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(244,236,223,0.07)";
      for (let i = 0; i < 9; i++)
        for (let j = i + 1; j < 9; j++) {
          const [x0, y0] = pt(i, R);
          const [x1, y1] = pt(j, R);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      // the question's triangle, then a dot running round it
      if (lit.length === 3) {
        const ps = lit.map((l) => pt(LETTERS.indexOf(l as Letter), R));
        ctx.lineWidth = 2;
        ctx.strokeStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        for (let e = 0; e < 3; e++) {
          const f = Math.max(0, Math.min(1, prog * 3 - e));
          if (!f) break;
          const [x0, y0] = ps[e];
          const [x1, y1] = ps[(e + 1) % 3];
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (prog >= 1) {
          const u = reduce.current ? 0 : (t * 0.45) % 1;
          const e = Math.floor(u * 3);
          const f = u * 3 - e;
          const [x0, y0] = ps[e];
          const [x1, y1] = ps[(e + 1) % 3];
          ctx.fillStyle = "#fff";
          ctx.shadowColor = accent;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      // the nine letters and what they stand for
      LETTERS.forEach((l, i) => {
        const on = lit.includes(l);
        const [x, y] = pt(i, R);
        if (focus.includes(l)) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 23, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
        ctx.fillStyle = on ? accent : "#070605";
        ctx.beginPath();
        ctx.arc(x, y, on ? 17 : 15, 0, Math.PI * 2);
        ctx.fill();
        if (!on) {
          ctx.strokeStyle = "rgba(244,236,223,0.18)";
          ctx.stroke();
        }
        ctx.fillStyle = on ? "#fff" : "rgba(244,236,223,0.7)";
        ctx.font = `${on ? 24 : 21}px ${display}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(l, x, y + 1);
        const [lx, ly] = pt(i, R + 30 + 12 * Math.abs(Math.sin((i * 40 * Math.PI) / 180)));
        const word = (on && meaning[l] ? meaning[l] : ALPHABET[l].dignity).toUpperCase();
        ctx.font = `9px ${mono}`;
        ctx.fillStyle = on ? "#f4ecdf" : "rgba(154,145,132,0.75)";
        ctx.fillText(word, lx, ly);
        inkLeft = Math.min(inkLeft, lx - ctx.measureText(word).width / 2, x - 23);
      });
      // line the wheel's leftmost ink up with the text above it
      const pull = Math.max(0, Math.floor(inkLeft));
      if (Math.abs(pull - pulled) > 1) {
        pulled = pull;
        cv.style.marginLeft = `-${pull}px`;
      }
    };

    const tick = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce.current && !document.hidden) raf = requestAnimationFrame(tick);
    };
    redrawRef.current = () => draw(performance.now());
    size();
    draw(performance.now());
    document.fonts?.ready.then(() => draw(performance.now()));
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(cv);
    document.addEventListener("visibilitychange", start);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => clearTimers, []);

  useEffect(() => {
    const stop = () => (following.current = false);
    const opts = { passive: true } as const;
    addEventListener("touchstart", stop, opts);
    addEventListener("wheel", stop, opts);
    addEventListener("keydown", stop);
    return () => {
      removeEventListener("touchstart", stop);
      removeEventListener("wheel", stop);
      removeEventListener("keydown", stop);
    };
  }, []);

  const stacked = () => matchMedia("(max-width: 899px)").matches;
  const behavior = (): ScrollBehavior => (reduce.current ? "auto" : "smooth");
  /** Bring the question to the top, so the whole wheel shows under it. */
  const showWheel = () => {
    const el = leftRef.current;
    if (!el || !stacked()) return;
    following.current = true;
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 16, behavior: behavior() });
  };
  /** Scroll just enough to show the answer's newest part (after React has drawn it). */
  const follow = () =>
    requestAnimationFrame(() => {
      const box = rightRef.current;
      if (!box || !following.current || !stacked()) return;
      const last = [...box.querySelectorAll(".llull-answer, .llull-reason")].pop();
      if (!last) return;
      const bottom = last.getBoundingClientRect().bottom + 16;
      if (bottom > innerHeight) scrollBy({ top: bottom - innerHeight, behavior: behavior() });
    });

  const setWheel = (lit: string[], meaning: Record<string, string>, triStart: number) => {
    Object.assign(drawState.current, { lit, focus: [], meaning, triStart });
    redrawRef.current();
  };

  function ask() {
    clearTimers();
    setToast("");
    setShown(0);
    const meaning = Object.fromEntries(q.letters.map((l) => [l.letter, shortMeaning(l.as)]));
    if (reduce.current) {
      setWheel([...q.column], meaning, -1e9);
      setShown(q.reasons.length);
      setPhase("done");
      showWheel();
      play("verdict");
      return;
    }
    setWheel([...q.column], meaning, performance.now());
    setPhase("wheel");
    showWheel();
    later(ANSWER_AT, () => {
      setPhase("answer");
      play("verdict");
      follow();
    });
    q.reasons.forEach((r, i) => {
      later(ANSWER_AT + WHY_AFTER + i * REASON_MS, () => {
        setPhase("why");
        setShown(i + 1);
        drawState.current.focus = [...r.letters];
        play("reason");
        follow();
      });
    });
    later(ANSWER_AT + WHY_AFTER + q.reasons.length * REASON_MS, () => {
      drawState.current.focus = [];
      setPhase("done");
    });
  }

  /** A tap on the wheel skips the animation. */
  function skip() {
    if (phase === "idle" || phase === "done") return;
    clearTimers();
    Object.assign(drawState.current, { triStart: -1e9, focus: [] });
    redrawRef.current();
    setShown(q.reasons.length);
    setPhase("done");
  }

  function another() {
    clearTimers();
    setPhase("idle");
    setShown(0);
    setToast("");
    setWheel([], {}, 0);
    setIndex((i) => (i + 1) % questions.length);
  }

  async function share() {
    const text = `${q.question}\n${q.verdict}\n— Ramon Llull's Art, Cabinet of AI\n${location.origin}${location.pathname}`;
    try {
      if (canShare) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setToast("Copied");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setToast("Your browser refused to copy");
    }
  }

  const answered = phase === "answer" || phase === "why" || phase === "done";
  const busy = phase === "wheel" || phase === "answer" || phase === "why";

  return (
    <div className="llull">
      <div className="llull-stage">
        <div className="llull-left" ref={leftRef}>
          <div className="llull-question">
            <span className={q.kind === "startup" ? "llull-who llull-2026" : "llull-who"}>
              {q.kind === "startup" ? "Asked in 2026" : "Asked by Llull, 1308"}
            </span>
            <span className="llull-q">{q.question}</span>
          </div>
          <div className="llull-buttons">
            <button type="button" className="llull-ask" onClick={ask} disabled={busy}>
              {phase === "idle" ? "Ask the Art" : "Ask again"}
            </button>
            <button type="button" className="llull-other" onClick={another}>
              Another question
            </button>
          </div>
          <div className={busy ? "llull-wheel is-busy" : "llull-wheel"} onClick={skip} title={busy ? "Tap to skip" : undefined}>
            <canvas ref={canvasRef} aria-hidden="true" />
            <p className="sr-only">
              Llull's nine letters, B to K, on a circle.{" "}
              {phase !== "idle" &&
                `This question is read as ${q.letters.map((l) => `${l.letter}, ${shortMeaning(l.as)}`).join("; ")}.`}
            </p>
          </div>
        </div>

        <div className="llull-right" ref={rightRef} aria-live="polite">
          {phase !== "idle" && (
            <div className={answered ? "llull-answer is-on" : "llull-answer"}>
              <span className="llull-says">The Art answers</span>
              <span className="llull-verdict">{q.verdict}</span>
              <span className="llull-source">
                {q.kind === "startup" ? "Asked in 2026. Answered with Llull's definitions." : q.source}
              </span>
              <div className="llull-share">
                <button
                  type="button"
                  className="llull-icon"
                  onClick={share}
                  aria-label={canShare ? "Share this answer" : "Copy this answer"}
                  title={canShare ? "Share" : "Copy"}>
                  {canShare ? <ShareIcon /> : <CopyIcon />}
                </button>
                <span className="llull-toast" role="status">
                  {toast}
                </span>
              </div>
            </div>
          )}
          {shown > 0 && (
            <div className="llull-why">
              <h3>Why</h3>
              {q.reasons.slice(0, shown).map((r) => (
                <div className="llull-reason" key={r.letters + r.plain}>
                  <span className="llull-plain">{r.plain}</span>
                  {llullWords(r.line) && <span className="llull-words">{llullWords(r.line)}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="llull-how" aria-labelledby="llull-how-title">
        <span className="label" id="llull-how-title">
          How does the Art work?
        </span>
        <p className="llull-how-intro">Ramon Llull, a Majorcan philosopher, finished it in 1308.</p>
        <ol className="llull-steps">
          <li>
            <span className="llull-n">01</span>
            <b>Nine letters</b>
            <span>Each stands for a big idea: B is Goodness, C is Greatness, D is Eternity…</span>
          </li>
          <li>
            <span className="llull-n">02</span>
            <b>Three per question</b>
            <span>Every question is made of three of those letters.</span>
          </li>
          <li>
            <span className="llull-n">03</span>
            <b>Wheels turn</b>
            <span>Paper wheels turn until the three letters line up.</span>
          </li>
          <li>
            <span className="llull-n">04</span>
            <b>Only the true is kept</b>
            <span>The Art combines them and keeps only what agrees with Llull's definitions. It can't be wrong. By design.</span>
          </li>
        </ol>
        <p className="llull-how-note">
          Six questions are Llull's own, answered in his words. Three are from 2026, answered with his definitions.
        </p>
      </section>
    </div>
  );
}

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
