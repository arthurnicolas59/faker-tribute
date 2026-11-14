import { describe, expect, it } from "vitest";
import { ANNEE_DEBUTS, etapeParcoursSchema } from "../src/data/parcours-schema";

const valide = {
  annee: ANNEE_DEBUTS,
  titre: "Les débuts",
  texte: "Un texte assez long pour être une étape du Parcours de Faker.",
};

describe("le schéma d'une étape du Parcours", () => {
  it("accepte une étape valide", () => {
    expect(etapeParcoursSchema.safeParse(valide).success).toBe(true);
  });

  it.each([
    ["un titre manquant", { ...valide, titre: undefined }],
    ["un titre vide", { ...valide, titre: "  " }],
    ["un texte vide", { ...valide, texte: "" }],
    ["une année avant 2013", { ...valide, annee: ANNEE_DEBUTS - 1 }],
    ["une année dans le futur lointain", { ...valide, annee: 3000 }],
    ["une année non entière", { ...valide, annee: 2013.5 }],
    ["une année en texte", { ...valide, annee: "deux mille treize" }],
  ])("refuse %s", (_nom, donnee) => {
    expect(etapeParcoursSchema.safeParse(donnee).success).toBe(false);
  });
});
