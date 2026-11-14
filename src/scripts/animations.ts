const DUREE_COMPTEUR_MS = 1000;
const SELECTEUR_SECTIONS = "header.en-tete, main > section";

/** Valeur affichée par le compteur après `ecoule` ms : de 0 au total, en ralentissant à la fin. */
export function valeurCompteur(
  total: number,
  ecoule: number,
  duree: number,
): number {
  const avancement = Math.min(Math.max(ecoule / duree, 0), 1);
  const adouci = 1 - (1 - avancement) ** 3;
  return Math.round(total * adouci);
}

function animerCompteur(element: HTMLElement): void {
  const total = Number(element.dataset.total);
  if (!Number.isFinite(total)) return;
  const debut = performance.now();
  const image = (maintenant: number) => {
    const ecoule = maintenant - debut;
    element.textContent = String(
      valeurCompteur(total, ecoule, DUREE_COMPTEUR_MS),
    );
    if (ecoule < DUREE_COMPTEUR_MS) requestAnimationFrame(image);
  };
  element.textContent = "0";
  requestAnimationFrame(image);
}

/** Fondu des Sections et compteurs du Palmarès, sauf si l'appareil demande de réduire les animations. */
export function initialiserAnimations(): void {
  if (typeof IntersectionObserver === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const racine = document.documentElement;
  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const { target, isIntersecting } of entrees) {
        if (!isIntersecting) continue;
        observateur.unobserve(target);
        target.classList.add("visible");
        for (const chiffre of target.querySelectorAll<HTMLElement>(
          "[data-total]",
        )) {
          animerCompteur(chiffre);
        }
      }
    },
    { threshold: 0.1 },
  );

  for (const section of document.querySelectorAll(SELECTEUR_SECTIONS)) {
    section.classList.add("apparition");
    observateur.observe(section);
  }
  // Posée en dernier : si le script plante avant, rien n'est masqué.
  racine.classList.add("animations");
}
