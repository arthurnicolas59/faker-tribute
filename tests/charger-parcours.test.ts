import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chargerParcours } from "../src/data/charger-parcours";

function fichier(contenu: string): string {
  const chemin = join(mkdtempSync(join(tmpdir(), "parcours-")), "parcours.yaml");
  writeFileSync(chemin, contenu);
  return chemin;
}

const etape = (annee: number) => `  annee: ${annee}\n  titre: Titre\n  texte: Texte\n`;

describe("la lecture du fichier du Parcours", () => {
  it("donne une étape par clé, dans l'ordre du fichier, avec la clé comme nom", async () => {
    const etapes = await chargerParcours(fichier(`debuts:\n${etape(2013)}suite:\n${etape(2015)}`));

    expect(etapes).toEqual([
      { id: "debuts", annee: 2013, titre: "Titre", texte: "Texte" },
      { id: "suite", annee: 2015, titre: "Titre", texte: "Texte" },
    ]);
  });

  it.each([
    ["deux étapes du même nom", `debuts:\n${etape(2013)}debuts:\n${etape(2015)}`],
    ["un fichier sans étape", "# rien\n"],
    ["une liste au lieu d'étapes nommées", `- annee: 2013\n  titre: T\n  texte: T\n`],
    ["une étape réduite à un texte", `debuts: juste un texte\n`],
    ["un fichier mal écrit", `debuts:\n  annee: 2013\n titre: décalé\n`],
  ])("refuse %s", async (_nom, contenu) => {
    await expect(chargerParcours(fichier(contenu))).rejects.toThrow();
  });
});
