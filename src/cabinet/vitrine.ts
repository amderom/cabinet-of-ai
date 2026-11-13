/**
 * Choosing a plate in the home page's vitrine: the first tap brings it forward (the page glow
 * takes its colour); tapping it again, or "Enter the exhibit", follows its link; tapping
 * outside puts it back. Without this script the plates are plain links.
 */
const SITE_ACCENT = "#f4ecdf"; // cream: the home page belongs to no exhibit

export function initVitrine() {
  const vitrine = document.querySelector<HTMLElement>("[data-vitrine]");
  if (!vitrine || vitrine.dataset.ready) return;
  vitrine.dataset.ready = "1";
  const detail = vitrine.querySelector<HTMLElement>("[data-detail]")!;
  const plates = [...vitrine.querySelectorAll<HTMLElement>(".vt-plate")];
  let chosen: HTMLElement | null = null;

  const setGlow = (accent: string) => document.body.style.setProperty("--accent", accent);

  function release() {
    chosen?.classList.remove("vt-chosen");
    chosen?.style.removeProperty("--to");
    chosen = null;
    vitrine!.classList.remove("vt-focus");
    detail.replaceChildren();
    setGlow(SITE_ACCENT);
  }

  function choose(plate: HTMLElement) {
    release();
    chosen = plate;
    // Move the plate's centre to the middle of the case, a little above the caption.
    const box = vitrine!.getBoundingClientRect();
    const p = plate.getBoundingClientRect();
    const dx = box.left + box.width / 2 - (p.left + p.width / 2);
    const dy = box.top + Math.min(box.height / 2, 200) - (p.top + p.height / 2);
    plate.style.setProperty("--to", `translate(${dx}px, ${dy}px) scale(1.3)`);
    plate.classList.add("vt-chosen");
    vitrine!.classList.add("vt-focus");
    setGlow(plate.dataset.accent ?? SITE_ACCENT);

    const status = document.createElement("span");
    status.className = "label";
    status.textContent = [plate.dataset.year, plate.matches("a") ? "Open" : "Sealed"].filter(Boolean).join(" · ");
    const action = document.createElement(plate.matches("a") ? "a" : "span");
    if (action instanceof HTMLAnchorElement) {
      action.href = (plate as HTMLAnchorElement).href;
      action.className = "vt-enter";
      action.textContent = "Enter the exhibit →";
    } else {
      action.className = "vt-later";
      action.textContent = "Opening later in the series";
    }
    detail.replaceChildren(status, action);
    detail.style.setProperty("--c", getComputedStyle(plate).getPropertyValue("--c"));
  }

  function shake(plate: HTMLElement) {
    plate.classList.remove("vt-shake");
    void plate.offsetWidth;
    plate.classList.add("vt-shake");
  }

  for (const plate of plates) {
    if (!plate.matches("a")) plate.tabIndex = 0;
    plate.addEventListener("click", (event) => {
      if (plate === chosen) {
        if (!plate.matches("a")) shake(plate);
        return; // an open plate's link is followed as usual
      }
      event.preventDefault();
      choose(plate);
    });
    plate.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !plate.matches("a")) {
        event.preventDefault();
        plate.click();
      }
    });
  }

  vitrine.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".vt-plate") && !target.closest("[data-detail] a")) release();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chosen) release();
  });
  setGlow(SITE_ACCENT);
}
