/**
 * The home page's vitrine: open cards are ordinary links (one tap goes to the exhibit; the
 * halo on hover is CSS). This script only handles sealed cards: a tap shakes the card and
 * says "Opening later in the series" for a moment.
 */
export function initVitrine() {
  const vitrine = document.querySelector<HTMLElement>("[data-vitrine]");
  if (!vitrine || vitrine.dataset.ready) return;
  vitrine.dataset.ready = "1";

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
