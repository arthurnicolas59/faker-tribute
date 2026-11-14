import { describe, expect, it } from "vitest";
import { ANNEE_DEBUTS } from "../src/data/parcours-schema";
import { CATEGORIES_PALMARES, categoriePalmaresSchema } from "../src/data/palmares-schema";

const worlds = {
  categorie: "worlds",
  victoires: [
    { annee: 2013, lieu: "Los Angeles" },
    { annee: 2015, lieu: "Berlin" },
  ],
};

const lck = {
  categorie: "lck",
  victoires: [
    { annee: 2015, saison: "printemps" },
    { annee: 2015, saison: "ete" },
  ],
};

describe("le schéma d'une catégorie du Palmarès", () => {
  it("connaît quatre catégories, dans l'ordre d'affichage", () => {
    expect(CATEGORIES_PALMARES).toEqual(["worlds", "msi", "lck", "jeux-asiatiques"]);
  });

  it.each([
    ["des Worlds avec leur lieu", worlds],
    ["deux titres LCK la même année, à deux saisons", lck],
    ["une victoire sans lieu", { categorie: "msi", victoires: [{ annee: 2016 }] }],
  ])("accepte %s", (_nom, donnee) => {
    expect(categoriePalmaresSchema.safeParse(donnee).success).toBe(true);
  });

  it.each([
    ["une catégorie inconnue", { ...worlds, categorie: "mondial" }],
    ["une catégorie manquante", { victoires: worlds.victoires }],
    ["une catégorie sans victoire", { ...worlds, victoires: [] }],
    ["une année avant 2013", { ...worlds, victoires: [{ annee: ANNEE_DEBUTS - 1 }] }],
    ["une année dans le futur lointain", { ...worlds, victoires: [{ annee: 3000 }] }],
    ["une année non entière", { ...worlds, victoires: [{ annee: 2013.5 }] }],
    ["une année en texte", { ...worlds, victoires: [{ annee: "deux mille treize" }] }],
    ["un total saisi à la main", { ...worlds, total: 2 }],
    ["un lieu vide", { ...worlds, victoires: [{ annee: 2013, lieu: " " }] }],
    ["la même victoire deux fois", { ...worlds, victoires: [{ annee: 2013 }, { annee: 2013 }] }],
    ["un titre LCK sans saison", { ...lck, victoires: [{ annee: 2015 }] }],
    ["une saison inconnue", { ...lck, victoires: [{ annee: 2015, saison: "automne" }] }],
    [
      "le même titre LCK deux fois",
      { ...lck, victoires: [{ annee: 2019, saison: "ete" }, { annee: 2019, saison: "ete" }] },
    ],
  ])("refuse %s", (_nom, donnee) => {
    expect(categoriePalmaresSchema.safeParse(donnee).success).toBe(false);
  });
});
