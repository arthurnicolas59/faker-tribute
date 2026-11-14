import { describe, expect, it } from "vitest";
import { ordonnerPalmares } from "../src/data/palmares";

describe("le rangement du Palmarès", () => {
  it("range les catégories dans l'ordre fixe et les victoires par année puis saison", () => {
    const rangement = ordonnerPalmares([
      { categorie: "jeux-asiatiques", victoires: [{ annee: 2026 }, { annee: 2023 }] },
      {
        categorie: "lck",
        victoires: [
          { annee: 2015, saison: "ete" },
          { annee: 2014, saison: "hiver" },
          { annee: 2015, saison: "printemps" },
        ],
      },
      { categorie: "worlds", victoires: [{ annee: 2016 }, { annee: 2013 }] },
      { categorie: "msi", victoires: [{ annee: 2017 }] },
    ]);

    expect(rangement).toEqual([
      { categorie: "worlds", victoires: [{ annee: 2013 }, { annee: 2016 }], total: 2 },
      { categorie: "msi", victoires: [{ annee: 2017 }], total: 1 },
      {
        categorie: "lck",
        victoires: [
          { annee: 2014, saison: "hiver" },
          { annee: 2015, saison: "printemps" },
          { annee: 2015, saison: "ete" },
        ],
        total: 3,
      },
      { categorie: "jeux-asiatiques", victoires: [{ annee: 2023 }, { annee: 2026 }], total: 2 },
    ]);
  });

  it("refuse un Palmarès où il manque une catégorie, pour que le build échoue", () => {
    expect(() =>
      ordonnerPalmares([
        { categorie: "worlds", victoires: [{ annee: 2013 }] },
        { categorie: "lck", victoires: [{ annee: 2015, saison: "ete" }] },
        { categorie: "jeux-asiatiques", victoires: [{ annee: 2023 }] },
      ]),
    ).toThrow(/msi/);
  });
});
