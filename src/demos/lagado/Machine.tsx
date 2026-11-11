/**
 * The Lagado frame and its folio: the playable part of the demo page.
 * Rules live in engine.ts and folio.ts; this file only draws and reacts.
 *
 * Desktop shows the frame as a square (places as columns, a crank on each column
 * and each row). A phone shows it on its side (places as rows, 3 words each, a
 * crank per place). Both layouts are rendered and CSS shows the one that fits,
 * so the server and the browser always agree.
 */
import { useEffect, useRef, useState } from "react";
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

export default function Machine() {
  const [frame, setFrame] = useState<Frame>(FIRST_FRAME);
  // Bumped on every turn so the flipped blocks (and the crank) replay their animation.
  const [turns, setTurns] = useState<{ cells: Set<string>; crank: string; n: number }>({ cells: new Set(), crank: "", n: 0 });
  const [folio, setFolio] = useState<Line[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; undo?: Line[] } | null>(null);
  const [canShare, setCanShare] = useState(false);
  // Temporary (Checkpoint C): which crank drawing to show, so the author can compare them.
  const [crankStyle, setCrankStyle] = useState<CrankStyle>("handle");
  // The folio is saved only once the saved one has been read, so it is never overwritten by an empty one.
  const [loaded, setLoaded] = useState(false);

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

  function apply(next: Frame, crank: string) {
    const cells = new Set<string>();
    next.rows.forEach((row, r) => row.forEach((w, p) => w !== frame.rows[r][p] && cells.add(`${r}-${p}`)));
    setFrame(next);
    setTurns((t) => ({ cells, crank, n: t.n + 1 }));
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

  const tile = (r: number, p: number) => {
    const word = frame.rows[r][p];
    const flipped = turns.cells.has(`${r}-${p}`);
    return (
      <button
        key={`${r}-${p}-${flipped ? turns.n : 0}`}
        type="button"
        className={`lagado-tile${flipped ? " is-flipped" : ""}`}
        aria-pressed={frame.picks[p] === r}
        onClick={() => setFrame((f) => pick(f, p, r))}>
        {noBreak(word)}
      </button>
    );
  };
  const crank = (id: string, label: string, onTurn: () => Frame) => (
    <button
      key={`${id}-${turns.crank === id ? turns.n : 0}`}
      type="button"
      className={`lagado-crank${turns.crank === id ? " is-turned" : ""}`}
      aria-label={label}
      onClick={() => apply(onTurn(), id)}>
      <CrankDrawing style={crankStyle} />
    </button>
  );
  const placeCrank = (p: number) => crank(`p${p}`, `Turn the ${PLACES[p].name.toLowerCase()} blocks (place ${p + 1})`, () => turnPlace(frame, p, random));

  return (
    <div className="lagado">
      <p className="lagado-intro">
        <span className="lagado-desk">Each column holds one kind of word. Turn a column or a row to flip its blocks. Pick one word per column.</span>
        <span className="lagado-phone">Each row holds one kind of word. Turn a row to flip its words. Pick one word per row.</span>
      </p>

      <div className="lagado-choice" role="group" aria-label="Crank design (temporary, to choose one)">
        <span className="label">Try a crank:</span>
        {CRANK_STYLES.map(([style, name]) => (
          <button key={style} type="button" aria-pressed={crankStyle === style} onClick={() => setCrankStyle(style)}>
            {name}
          </button>
        ))}
      </div>

      <div className="lagado-frame" role="group" aria-label="The word frame">
        {/* Desktop: the square. */}
        <div className="lagado-square lagado-desk">
          <span />
          {PLACES.map((place, p) => (
            <div key={p} className="lagado-colhead">
              <span className="label">{place.name}</span>
              {placeCrank(p)}
            </div>
          ))}
          {frame.rows.map((_, r) => [
            crank(`r${r}`, `Turn row ${r + 1}`, () => turnRow(frame, r, random)),
            ...PLACES.map((_, p) => tile(r, p)),
          ])}
        </div>

        {/* Phone: the same frame on its side. */}
        <div className="lagado-phone">
          {PLACES.map((place, p) => (
            <div key={p} className="lagado-place">
              <div className="lagado-place-head">
                <span className="label">{place.name}</span>
                {placeCrank(p)}
              </div>
              <div className="lagado-words">{frame.rows.slice(0, PHONE_ROWS).map((_, r) => tile(r, p))}</div>
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
                  <button
                    type="button"
                    className="lagado-icon"
                    aria-label="Delete this line"
                    title="Delete"
                    onClick={() => remove([line.id], "Line deleted.")}>
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

/**
 * A kept line the visitor can edit like text. The browser owns its text while it is
 * edited (React never redraws inside it), so typing can't confuse the page.
 */
function EditableText({ text, onSave }: { text: string; onSave: (text: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
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
      contentEditable="plaintext-only"
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

type CrankStyle = "handle" | "wheel" | "key";
const CRANK_STYLES: [CrankStyle, string][] = [
  ["handle", "A · Handle"],
  ["wheel", "B · Wheel"],
  ["key", "C · Winding key"],
];

/** Three crank drawings to choose from, as engraved line art (40 × 40). */
function CrankDrawing({ style }: { style: CrankStyle }) {
  if (style === "handle") {
    // A hub on its axle, an arm, and a turned wooden knob.
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="7" />
        <circle cx="20" cy="20" r="2.2" className="solid" />
        <path d="M14.5 15.5 18 19M15.5 14.5 19 18" className="hatch" />
        <path d="M22.5 17.5 31 9M24 19 32.5 10.5" />
        <rect x="29" y="3" width="7" height="9" rx="3.5" transform="rotate(45 32.5 7.5)" />
        <path d="M31 6.5 34 9.5" className="hatch" />
      </svg>
    );
  }
  if (style === "wheel") {
    // A spoked iron wheel with a rim and hub.
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="15" />
        <circle cx="20" cy="20" r="12.5" className="hatch" />
        <circle cx="20" cy="20" r="3" className="solid" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M20 7.5V32.5" transform={`rotate(${a} 20 20)`} />
        ))}
        {[0, 90, 180, 270].map((a) => (
          <circle key={a} cx="20" cy="3.5" r="1.6" className="solid" transform={`rotate(${a} 20 20)`} />
        ))}
      </svg>
    );
  }
  // A clockwork winding key: two rounded wings on a stem.
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 20V33" />
      <circle cx="20" cy="34" r="2" className="solid" />
      <path d="M20 20c-3-1-11-4-12-10s6-6 9-2 3 9 3 12Z" />
      <path d="M20 20c3-1 11-4 12-10s-6-6-9-2-3 9-3 12Z" />
      <path d="M12 10.5c1 2 3.5 4.5 6 6M28 10.5c-1 2-3.5 4.5-6 6" className="hatch" />
    </svg>
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
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
