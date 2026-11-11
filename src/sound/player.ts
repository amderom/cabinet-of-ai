/**
 * Sound in the browser: the page's one sound preference, and playback through Howler,
 * which is downloaded only once the visitor turns sound on. Visitors who stay silent
 * (by choice or because they never chose) never download it.
 *
 * Usage from an exhibit: `registerSounds({ crank: url })` once, then `play("crank")`
 * on each gesture. Nothing plays unless sound is on.
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

let howler: Promise<typeof import("howler")> | undefined;
const sources = new Map<string, string>();
const howls = new Map<string, HowlType>();

/** Downloads Howler (once) and prepares every registered sound. Only called when sound is on. */
async function prepare(): Promise<void> {
  howler ??= import("howler");
  const { Howl, Howler } = await howler;
  // Sound may have been turned off while Howler was downloading.
  Howler.mute(store.get() !== "on");
  for (const [id, src] of sources) {
    if (!howls.has(id)) howls.set(id, new Howl({ src: [src] }));
  }
}

export function registerSounds(map: Record<string, string>): void {
  for (const [id, src] of Object.entries(map)) sources.set(id, src);
  if (store.get() === "on") void prepare();
}

/** Plays a registered sound if sound is on and the sound is ready; otherwise does nothing. */
export function play(id: string): void {
  if (store.get() !== "on") return;
  const howl = howls.get(id);
  if (howl) howl.play();
  else void prepare();
}

if (typeof window !== "undefined") {
  onPreferenceChange((value) => {
    if (value === "on") void prepare();
    else if (howler) void howler.then(({ Howler }) => Howler.mute(true));
  });
  if (store.get() === "on") void prepare();
}
