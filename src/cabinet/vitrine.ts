/**
 * The home page's vitrine. Open cards are ordinary links (one tap goes to the exhibit).
 * This script adds:
 * - with a mouse (or keyboard focus): a soft glow in the card's colour, centred behind the
 *   hovered card, spreading across the page; none at rest and none on touch screens;
 * - on sealed cards: a tap shakes the card and says "Opening later in the series" for a moment.
 */
export function initVitrine() {
  const vitrine = document.querySelector<HTMLElement>("[data-vitrine]");
  if (!vitrine || vitrine.dataset.ready) return;
  vitrine.dataset.ready = "1";
  const glow = document.querySelector<HTMLElement>("[data-glow]")!;

  const light = (slot: HTMLElement) => {
    const card = slot.getBoundingClientRect();
    glow.style.setProperty("--g", slot.style.getPropertyValue("--c"));
    glow.style.setProperty("--gx", `${card.left + card.width / 2}px`);
    glow.style.setProperty("--gy", `${card.top + card.height / 2}px`);
    glow.classList.add("vt-on");
  };
  const dim = () => glow.classList.remove("vt-on");
  // The glow is fixed to the screen: if the page scrolls under the mouse, let it fade.
  addEventListener("scroll", dim, { passive: true });

  for (const slot of vitrine.querySelectorAll<HTMLElement>(".vt-slot")) {
    const card = slot.querySelector<HTMLElement>(".vt-card")!;
    card.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && light(slot));
    card.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && dim());
    card.addEventListener("focus", () => card.matches(":focus-visible") && light(slot));
    card.addEventListener("blur", dim);
  }

  for (const card of vitrine.querySelectorAll<HTMLElement>(".vt-sealed")) {
    card.tabIndex = 0;
    const note = card.querySelector<HTMLElement>("[data-note]")!;
    let timer = 0;
    const tell = () => {
      card.classList.remove("vt-shake");
      void card.offsetWidth;
      card.classList.add("vt-shake");
      note.textContent = "Opening later in the series";
      note.classList.add("vt-on");
      clearTimeout(timer);
      timer = window.setTimeout(() => note.classList.remove("vt-on"), 2200);
    };
    card.addEventListener("click", tell);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tell();
      }
    });
  }
}
