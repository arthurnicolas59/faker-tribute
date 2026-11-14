import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chargerPalmares } from "../src/data/charger-palmares";

function fichier(contenu: string): string {
  const chemin = join(mkdtempSync(join(tmpdir(), "palmares-")), "palmares.yaml");
  writeFileSync(chemin, contenu);
  return chemin;
}

describe("la lecture du fichier du Palmarès", () => {
  it("donne une entrée par catégorie, la clé servant de nom et de catégorie", async () => {
    const entrees = await chargerPalmares(
      fichier(`msi:\n  - annee: 2016\nlck:\n  - annee: 2013\n    saison: ete\n`),
    );

    expect(entrees).toEqual([
      { id: "msi", categorie: "msi", victoires: [{ annee: 2016 }] },
      { id: "lck", categorie: "lck", victoires: [{ annee: 2013, saison: "ete" }] },
    ]);
  });

  it.each([
    ["deux catégories du même nom", `msi:\n  - annee: 2016\nmsi:\n  - annee: 2017\n`],
    ["un fichier sans catégorie", "# rien\n"],
    ["une liste au lieu de catégories nommées", `- annee: 2016\n`],
    ["une catégorie sans liste de victoires", `msi: 2016\n`],
    ["un fichier mal écrit", `msi:\n  - annee: 2016\n annee: 2017\n`],
  ])("refuse %s", async (_nom, contenu) => {
    await expect(chargerPalmares(fichier(contenu))).rejects.toThrow();
  });
});
