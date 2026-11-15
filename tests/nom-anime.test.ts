import { describe, expect, it } from "vitest";
import { textesDuSite } from "../src/data/site";
import {
  DUREE_APPARITION_LETTRE_S,
  DUREE_MAX_NOM_S,
  delaisApparition,
  lettresDuNom,
} from "../src/data/nom-anime";
import { renderPage } from "./helpers/render-page";

describe("delaisApparition", () => {
  it("donne un délai croissant par lettre, à partir de 0", () => {
    const delais = delaisApparition(5);
    expect(delais).toHaveLength(lettresDuNom(textesDuSite.enTete.nom).length);
    expect(delais[0]).toBe(0);
    for (let i = 1; i < delais.length; i++) {
      expect(delais[i]).toBeGreaterThan(delais[i - 1]);
    }
  });

  it("finit la dernière lettre en 1,5 s au plus, même pour un nom plus long", () => {
    for (const n of [1, 5, 12, 30]) {
      const delais = delaisApparition(n);
      expect(delais[n - 1] + DUREE_APPARITION_LETTRE_S).toBeLessThanOrEqual(DUREE_MAX_NOM_S);
    }
  });

  it("renvoie une liste vide sans lettre", () => {
    expect(delaisApparition(0)).toEqual([]);
  });
});

describe("le nom animé dans l'En-tête", () => {
  it("est annoncé comme un seul mot, le nom entier, par le h1", async () => {
    const page = await renderPage();
    expect(page.querySelector("h1")?.getAttribute("aria-label")).toBe(textesDuSite.enTete.nom);
  });

  it("rend chaque lettre dans un span séparé, caché aux lecteurs d'écran", async () => {
    const page = await renderPage();
    const lettres = page.querySelectorAll("h1 .lettre");
    expect(lettres.map((l) => l.textContent)).toEqual(lettresDuNom(textesDuSite.enTete.nom));
    for (const lettre of lettres) {
      expect(lettre.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("donne à chaque lettre un délai croissant, la dernière finissant en 1,5 s au plus", async () => {
    const page = await renderPage();
    const delais = page.querySelectorAll("h1 .lettre").map((l) => {
      const m = /--delai:\s*([\d.]+)s/.exec(l.getAttribute("style") ?? "");
      return Number(m?.[1]);
    });
    expect(delais).toHaveLength(lettresDuNom(textesDuSite.enTete.nom).length);
    expect(delais.every((d) => Number.isFinite(d))).toBe(true);
    for (let i = 1; i < delais.length; i++) {
      expect(delais[i]).toBeGreaterThan(delais[i - 1]);
    }
    expect(delais[delais.length - 1] + DUREE_APPARITION_LETTRE_S).toBeLessThanOrEqual(
      DUREE_MAX_NOM_S,
    );
  });

  it("ne masque aucune lettre par défaut dans le HTML", async () => {
    const page = await renderPage();
    for (const lettre of page.querySelectorAll("h1 .lettre")) {
      expect(lettre.getAttribute("style") ?? "").not.toMatch(/opacity|visibility|display/);
    }
  });
});

describe("lettresDuNom", () => {
  it("découpe le nom en lettres affichées, accents composés compris", () => {
    expect(lettresDuNom("Faker")).toEqual(["F", "a", "k", "e", "r"]);
    expect(lettresDuNom("Fée")).toEqual(["F", "é", "e"]);
  });
});
