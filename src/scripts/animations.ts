const DUREE_COMPTEUR_MS = 1000;
const SELECTEUR_SECTIONS = "header.en-tete, main > section";

/** Valeur affichée par le compteur après `ecoule` ms : de 0 au total, en ralentissant à la fin. */
export function valeurCompteur(total: number, ecoule: number, duree: number): number {
  const avancement = Math.min(Math.max(ecoule / duree, 0), 1);
  const adouci = 1 - (1 - avancement) ** 3;
  return Math.round(total * adouci);
}

function animerCompteur(element: HTMLElement): void {
  const total = Number(element.dataset.total);
  if (!Number.isFinite(total)) return;
  const debut = performance.now();
  const etape = (maintenant: number) => {
    const ecoule = maintenant - debut;
    element.textContent = String(valeurCompteur(total, ecoule, DUREE_COMPTEUR_MS));
    if (ecoule < DUREE_COMPTEUR_MS) requestAnimationFrame(etape);
  };
  element.textContent = "0";
  requestAnimationFrame(etape);
}

/** Fondu des Sections et compteurs du Palmarès, sauf si l'appareil demande de réduire les animations. */
export function initialiserAnimations(): void {
  if (typeof IntersectionObserver === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const chiffres = [...document.querySelectorAll<HTMLElement>("[data-total]")];

  // Une Section apparaît en fondu ; un chiffre lance son compteur quand lui-même arrive à l'écran.
  const observateur = new IntersectionObserver((entrees) => {
    for (const { target, isIntersecting } of entrees) {
      if (!isIntersecting) continue;
      observateur.unobserve(target);
      const chiffre = chiffres.find((c) => c === target);
      if (chiffre) {
        animerCompteur(chiffre);
      } else {
        target.classList.add("visible");
      }
    }
  });

  for (const section of document.querySelectorAll(SELECTEUR_SECTIONS)) {
    // Une Section déjà affichée au chargement ne disparaît pas pour revenir en fondu.
    if (section.getBoundingClientRect().top < window.innerHeight) continue;
    section.classList.add("apparition");
    observateur.observe(section);
  }
  for (const chiffre of chiffres) observateur.observe(chiffre);
  // Posée en dernier : si le script plante avant, rien n'est masqué.
  document.documentElement.classList.add("animations");
}
