import { describe, expect, it } from "vitest";
import { renderPage } from "./helpers/render-page";

describe("les animations, vues depuis la page rendue", () => {
  it("contient les chiffres finaux du Palmarès dans le HTML, repérés par data-total", async () => {
    const page = await renderPage();

    const chiffres = page.querySelectorAll(".chiffre");
    expect(chiffres.map((c) => c.textContent.trim())).toEqual([
      "6",
      "2",
      "10",
      "2",
    ]);
    for (const chiffre of chiffres) {
      expect(chiffre.getAttribute("data-total")).toBe(
        chiffre.textContent.trim(),
      );
    }
  });

  it("ne masque aucune Section par défaut", async () => {
    const page = await renderPage();

    const sections = [
      page.querySelector("header"),
      ...page.querySelectorAll("main > section"),
    ];
    expect(sections).toHaveLength(4);
    for (const section of sections) {
      expect(section?.hasAttribute("hidden")).toBe(false);
      expect(section?.getAttribute("style") ?? "").not.toMatch(
        /opacity\s*:\s*0|display\s*:\s*none|visibility\s*:\s*hidden/,
      );
      expect(section?.getAttribute("class") ?? "").not.toMatch(
        /cache|masque|hidden|invisible/,
      );
    }
    expect(page.querySelector("html")?.getAttribute("class") ?? "").toBe("");
  });
});
