/**
 * Sound in the browser: the page's one sound preference, and playback through Howler,
 * which is downloaded only once the visitor turns sound on. Visitors who stay silent
 * (by choice or because they never chose) never download it.
 *
 * Usage from an exhibit: `registerSounds({ crank: { src: [oggUrl, m4aUrl] } })` once, then
 * `play("crank")` on each gesture. Nothing plays unless sound is on.
 */
import type { Howl as HowlType } from "howler";
import { CHANGE_EVENT, createSoundStore, type SoundPreference, type SoundStorage } from "./preference";

function deviceStorage(): SoundStorage {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const store = createSoundStore(deviceStorage(), (value) => {
  window.dispatchEvent(new CustomEvent<SoundPreference>(CHANGE_EVENT, { detail: value }));
});

export const getPreference = store.get;

export function setPreference(value: "on" | "off"): void {
  store.set(value);
}

/** Calls `listener` with every change of preference; returns a function that stops listening. */
export function onPreferenceChange(listener: (value: SoundPreference) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<SoundPreference>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/**
 * One sound: its files (Howler plays the first format the browser supports), how loud it
 * is (0–1, before the visitor's own volume), and, for a long recording, when to fade it out.
 */
export interface SoundSpec {
  src: string[];
  volume?: number;
  maxMs?: number;
}

const FADE_MS = 150;

let howler: Promise<typeof import("howler")> | undefined;
const specs = new Map<string, SoundSpec>();
const howls = new Map<string, HowlType>();

/** Downloads Howler (once) and prepares every registered sound. Only called when sound is on. */
async function prepare(): Promise<void> {
  howler ??= import("howler");
  const { Howl, Howler } = await howler;
  // Sound may have been turned off while Howler was downloading.
  Howler.mute(store.get() !== "on");
  for (const [id, spec] of specs) {
    if (!howls.has(id)) howls.set(id, new Howl({ src: spec.src, volume: spec.volume ?? 1 }));
  }
}

export function registerSounds(map: Record<string, SoundSpec>): void {
  for (const [id, spec] of Object.entries(map)) specs.set(id, spec);
  if (store.get() === "on") void prepare();
}

/** Plays a registered sound if sound is on and the sound is ready; otherwise does nothing. */
export function play(id: string): void {
  if (store.get() !== "on") return;
  const howl = howls.get(id);
  if (!howl) return void prepare();
  const playing = howl.play();
  const { maxMs, volume = 1 } = specs.get(id) ?? {};
  if (maxMs) {
    setTimeout(() => howl.fade(volume, 0, FADE_MS, playing), Math.max(0, maxMs - FADE_MS));
    setTimeout(() => howl.stop(playing), maxMs);
  }
}

if (typeof window !== "undefined") {
  onPreferenceChange((value) => {
    if (value === "on") void prepare();
    else if (howler) void howler.then(({ Howler }) => Howler.mute(true));
  });
  if (store.get() === "on") void prepare();
}
