import { describe, expect, it } from "vitest";
import { renderPage, textOf } from "./helpers/render-page";

describe("la page", () => {
  it("est en français, avec un titre d'onglet et une meta description", async () => {
    const page = await renderPage();

    expect(page.querySelector("html")?.getAttribute("lang")).toBe("fr");
    expect(textOf(page.querySelector("head > title"))).toContain("Faker");
    expect(
      page.querySelector('meta[name="description"]')?.getAttribute("content")?.length ?? 0,
    ).toBeGreaterThan(20);
    expect(page.querySelector('meta[name="viewport"]')?.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1",
    );
  });

  it("a un seul <h1>, le nom de Faker", async () => {
    const page = await renderPage();

    const titres = page.querySelectorAll("h1");
    expect(titres).toHaveLength(1);
    expect(textOf(titres[0])).toBe("Faker");
  });

  it("ouvre sur l'En-tête : le nom, le surnom et une accroche", async () => {
    const page = await renderPage();

    const enTete = page.querySelector("header");
    expect(enTete?.querySelector("h1")).not.toBeNull();
    const texte = textOf(enTete);
    expect(texte).toContain("The Unkillable Demon King");
    const accroche = texte.replace("Faker", "").replace("The Unkillable Demon King", "").trim();
    expect(accroche.length).toBeGreaterThan(20);
  });

  it("finit par la Mention site de fan : non officiel, sans lien avec Riot Games ni T1", async () => {
    const page = await renderPage();

    const piedDePage = page.querySelector("body > footer");
    expect(piedDePage).not.toBeNull();
    expect(page.querySelector("body")?.lastElementChild).toBe(piedDePage);
    const mention = textOf(piedDePage);
    expect(mention).toMatch(/non officiel/i);
    expect(mention).toContain("Riot Games");
    expect(mention).toContain("T1");
  });
});
