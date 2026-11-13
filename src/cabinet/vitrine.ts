/**
 * The home page's vitrine, small extras on top of plain links:
 * - hovering (or focusing) a card lights the page glow in that exhibit's colour;
 * - tapping a sealed card shakes it and says "Opening later in the series" for a moment.
 * Open cards are ordinary links: one tap goes to the exhibit.
 */
export function initVitrine() {
  const vitrine = document.querySelector<HTMLElement>("[data-vitrine]");
  if (!vitrine || vitrine.dataset.ready) return;
  vitrine.dataset.ready = "1";
  const body = document.body;

  const light = (card: HTMLElement) => {
    body.style.setProperty("--accent", card.dataset.accent ?? "");
    body.dataset.lit = "";
  };
  const dim = () => delete body.dataset.lit;

  for (const card of vitrine.querySelectorAll<HTMLElement>(".vt-card")) {
    card.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && light(card));
    card.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && dim());
    card.addEventListener("focus", () => light(card));
    card.addEventListener("blur", dim);

    if (card.matches(".vt-sealed")) {
      card.tabIndex = 0;
      const status = card.querySelector<HTMLElement>("[data-status]")!;
      let timer = 0;
      const tell = () => {
        card.classList.remove("vt-shake");
        void card.offsetWidth;
        card.classList.add("vt-shake");
        status.textContent = "Opening later in the series";
        clearTimeout(timer);
        timer = window.setTimeout(() => (status.textContent = "Sealed"), 2200);
      };
      card.addEventListener("click", tell);
      card.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), tell()));
    }
  }
}
