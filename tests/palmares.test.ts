import type { HTMLElement } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { renderPage, textOf } from "./helpers/render-page";

async function sectionPalmares(): Promise<HTMLElement | null> {
  const page = await renderPage();
  return page.querySelector("#titre-palmares")?.closest("section") ?? null;
}

function categories(palmares: HTMLElement | null): HTMLElement[] {
  return palmares?.querySelectorAll("article") ?? [];
}

const annees = (categorie: HTMLElement) =>
  categorie.querySelectorAll("li time").map((t) => Number(t.getAttribute("datetime")));

describe("la Section Palmarès", () => {
  it("suit le Parcours dans <main>, avec son titre <h2>", async () => {
    const page = await renderPage();

    const parcours = page.querySelector("#titre-parcours")?.closest("section");
    const palmares = page.querySelector("#titre-palmares")?.closest("section");
    expect(palmares).not.toBeNull();
    expect(palmares?.parentNode).toBe(page.querySelector("body > main"));
    expect(parcours?.nextElementSibling).toBe(palmares);

    const titre = palmares?.querySelector("h2") ?? null;
    expect(textOf(titre)).toMatch(/Palmarès/);
    expect(palmares?.getAttribute("aria-labelledby")).toBe(titre?.id);
  });

  it("présente Worlds en avant, puis MSI, LCK et Jeux asiatiques, chacun avec son <h3>", async () => {
    const liste = categories(await sectionPalmares());

    expect(liste.map((c) => textOf(c.querySelector("h3")))).toEqual([
      "Worlds",
      "MSI",
      "Champion de Corée (LCK)",
      "Jeux asiatiques",
    ]);
    expect(liste[0]?.classList.contains("en-avant")).toBe(true);
    expect(liste.slice(1).some((c) => c.classList.contains("en-avant"))).toBe(false);
  });

  it("affiche les années de chaque catégorie, dans l'ordre chronologique", async () => {
    const [worlds, msi, lck, jeux] = categories(await sectionPalmares());

    expect(annees(worlds!)).toEqual([2013, 2015, 2016, 2023, 2024, 2025]);
    expect(annees(msi!)).toEqual([2016, 2017]);
    expect(annees(lck!)).toEqual([2013, 2014, 2015, 2015, 2016, 2017, 2019, 2019, 2020, 2022]);
    expect(annees(jeux!)).toEqual([2023, 2026]);
  });

  it("précise la saison des titres LCK, pour distinguer deux titres la même année", async () => {
    const lck = categories(await sectionPalmares())[2]!;

    const victoires = lck.querySelectorAll("li").map((li) => textOf(li));
    expect(victoires).toContain("Printemps 2015");
    expect(victoires).toContain("Été 2015");
    expect(victoires).toContain("Hiver 2014");
  });

  it("affiche en texte le total de chaque catégorie, égal au nombre d'années", async () => {
    const liste = categories(await sectionPalmares());

    expect(liste.map((c) => textOf(c.querySelector(".total")))).toEqual([
      "6 titres",
      "2 titres",
      "10 titres",
      "2 médailles d'or",
    ]);
    for (const categorie of liste) {
      const total = Number.parseInt(textOf(categorie.querySelector(".total")), 10);
      expect(total).toBe(categorie.querySelectorAll("li").length);
    }
  });
});
