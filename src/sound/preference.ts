/**
 * The visitor's sound preference: unset (never asked), on, or off. Silent unless the
 * visitor turns sound on. Kept on the device (browser storage, never a cookie); when the
 * browser refuses storage (private mode), the choice still holds for the visit.
 *
 * The sound module imports nothing else from the app, so the cabinet can reuse it.
 */

export type SoundPreference = "unset" | "on" | "off";

/** The part of the browser's storage the preference needs; null when there is none. */
export type SoundStorage = Pick<Storage, "getItem" | "setItem"> | null;

export const STORAGE_KEY = "cabinet-of-ai:sound";

/** Fired on `window` whenever the preference changes; `detail` is the new preference. */
export const CHANGE_EVENT = "cabinet:sound-change";

export function readPreference(storage: SoundStorage): SoundPreference {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : "unset";
  } catch {
    return "unset";
  }
}

/** Returns false when the browser refused to save (the choice then lasts for the visit only). */
export function writePreference(storage: SoundStorage, value: "on" | "off"): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/** The mute toggle: from silence (chosen or never asked) to sound, and back. */
export function toggled(current: SoundPreference): "on" | "off" {
  return current === "on" ? "off" : "on";
}

/**
 * One shared preference for the page: read once from storage, kept in memory (so it
 * survives refused storage), and announced to every control and player that listens.
 */
export function createSoundStore(storage: SoundStorage, announce: (value: SoundPreference) => void = () => {}) {
  let current = readPreference(storage);
  return {
    get: (): SoundPreference => current,
    set(value: "on" | "off") {
      writePreference(storage, value);
      if (value === current) return;
      current = value;
      announce(value);
    },
  };
}
