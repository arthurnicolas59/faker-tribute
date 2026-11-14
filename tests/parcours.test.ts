import { describe, expect, it } from "vitest";
import { renderPage, textOf } from "./helpers/render-page";

describe("la Section Parcours", () => {
  it("est la première Section de <main>, après l'En-tête, avec son titre <h2>", async () => {
    const page = await renderPage();

    const enTete = page.querySelector("body > header");
    const main = page.querySelector("body > main");
    const parcours = main?.querySelector("section");
    expect(enTete).not.toBeNull();
    expect(parcours).not.toBeNull();
    expect(main?.firstElementChild).toBe(parcours);
    expect(enTete?.nextElementSibling).toBe(main);

    const titre = parcours?.querySelector("h2") ?? null;
    expect(titre).not.toBeNull();
    expect(textOf(titre)).toMatch(/Parcours/);
    expect(parcours?.getAttribute("aria-labelledby")).toBe(titre?.id);
  });

  it("raconte de 2013 à l'année la plus récente, en étapes ordonnées", async () => {
    const page = await renderPage();
    const parcours = page.querySelector("main > section");

    const etapes = parcours?.querySelectorAll("article") ?? [];
    expect(etapes.length).toBeGreaterThanOrEqual(5);
    expect(etapes.length).toBeLessThanOrEqual(7);
    for (const etape of etapes) {
      expect(etape.querySelector("h3")).not.toBeNull();
      expect(textOf(etape.querySelector("p")).length).toBeGreaterThan(40);
    }

    const annees = etapes.map((e) => Number(textOf(e.querySelector("time"))));
    expect(annees[0]).toBe(2013);
    expect(annees).toEqual([...annees].sort((a, b) => a - b));
    expect(annees.at(-1)).toBeGreaterThanOrEqual(2026);

    const texte = textOf(parcours);
    expect(texte).toContain("Lee Sang-hyeok");
    expect(texte).toContain("T1");
    const mots = texte.split(" ").length;
    expect(mots).toBeGreaterThan(300);
    expect(mots).toBeLessThan(650);
  });
});
