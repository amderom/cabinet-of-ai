import { describe, expect, it } from "vitest";
import { createSoundStore, readPreference, STORAGE_KEY, toggled, writePreference } from "./preference";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

const refusing = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

describe("sound preference", () => {
  it("is silent by default: never asked means unset", () => {
    expect(readPreference(memoryStorage())).toBe("unset");
    expect(readPreference(null)).toBe("unset");
  });

  it("remembers the choice on the device", () => {
    const storage = memoryStorage();
    expect(writePreference(storage, "on")).toBe(true);
    expect(readPreference(storage)).toBe("on");
    writePreference(storage, "off");
    expect(readPreference(storage)).toBe("off");
  });

  it("ignores anything else found in storage", () => {
    expect(readPreference(memoryStorage({ [STORAGE_KEY]: "loud" }))).toBe("unset");
  });

  it("works without errors when the browser refuses storage", () => {
    expect(readPreference(refusing)).toBe("unset");
    expect(writePreference(refusing, "on")).toBe(false);
    expect(writePreference(null, "on")).toBe(false);
  });

  it("mute toggle: silence (chosen or never asked) turns to sound, sound to silence", () => {
    expect(toggled("unset")).toBe("on");
    expect(toggled("off")).toBe("on");
    expect(toggled("on")).toBe("off");
  });
});

describe("sound store", () => {
  it("starts from the saved choice and announces each change once", () => {
    const heard: string[] = [];
    const store = createSoundStore(memoryStorage({ [STORAGE_KEY]: "off" }), (v) => heard.push(v));
    expect(store.get()).toBe("off");
    store.set("on");
    store.set("on");
    store.set("off");
    expect(heard).toEqual(["on", "off"]);
  });

  it("keeps the choice for the visit when storage is refused", () => {
    const store = createSoundStore(refusing);
    store.set("on");
    expect(store.get()).toBe("on");
  });
});
