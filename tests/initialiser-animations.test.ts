import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initialiserAnimations } from "../src/scripts/animations";

// Un faux navigateur minimal : juste ce que le script utilise.
type FauxElement = {
  classList: { add: (c: string) => void; contains: (c: string) => boolean };
  dataset: Record<string, string>;
  textContent: string;
  getBoundingClientRect: () => { top: number };
};

function element(top: number, dataset: Record<string, string> = {}, texte = ""): FauxElement {
  const classes = new Set<string>();
  return {
    classList: { add: (c) => classes.add(c), contains: (c) => classes.has(c) },
    dataset,
    textContent: texte,
    getBoundingClientRect: () => ({ top }),
  };
}

const HAUTEUR_ECRAN = 800;
let reduire: boolean;
let rappel: ((entrees: { target: FauxElement; isIntersecting: boolean }[]) => void) | undefined;
let observes: FauxElement[];
let racine: FauxElement;
let enTete: FauxElement;
let palmares: FauxElement;
let chiffreDuBas: FauxElement;

function entree(target: FauxElement) {
  rappel?.([{ target, isIntersecting: true }]);
}

beforeEach(() => {
  reduire = false;
  rappel = undefined;
  observes = [];
  racine = element(0);
  enTete = element(0);
  palmares = element(2000);
  chiffreDuBas = element(3000, { total: "10" }, "10");

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: typeof rappel) {
        rappel = cb;
      }
      observe(cible: FauxElement) {
        observes.push(cible);
      }
      unobserve() {}
    },
  );
  vi.stubGlobal("window", {
    innerHeight: HAUTEUR_ECRAN,
    matchMedia: () => ({ matches: reduire }),
  });
  vi.stubGlobal("document", {
    documentElement: racine,
    querySelectorAll: (selecteur: string) =>
      selecteur === "[data-total]" ? [chiffreDuBas] : [enTete, palmares],
  });
  vi.stubGlobal("requestAnimationFrame", () => 0);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("initialiserAnimations", () => {
  it("ne fait rien quand l'appareil demande de réduire les animations", () => {
    reduire = true;
    initialiserAnimations();

    expect(racine.classList.contains("animations")).toBe(false);
    expect(observes).toEqual([]);
    expect(palmares.classList.contains("apparition")).toBe(false);
  });

  it("ne cache pas une Section déjà à l'écran au chargement, et cache celles plus bas", () => {
    initialiserAnimations();

    expect(enTete.classList.contains("apparition")).toBe(false);
    expect(palmares.classList.contains("apparition")).toBe(true);
    expect(racine.classList.contains("animations")).toBe(true);
  });

  it("lance le compteur quand le chiffre arrive à l'écran, pas quand sa Section y entre", () => {
    initialiserAnimations();

    entree(palmares);
    expect(palmares.classList.contains("visible")).toBe(true);
    expect(chiffreDuBas.textContent).toBe("10");

    entree(chiffreDuBas);
    expect(chiffreDuBas.textContent).toBe("0");
  });
});
