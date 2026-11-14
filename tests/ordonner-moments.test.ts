import { describe, expect, it } from "vitest";
import { dateLisible, ordonnerMoments } from "../src/data/moments";
import type { MomentMythique } from "../src/data/moments-schema";

const moment = (titre: string, date: string): MomentMythique => ({
  titre,
  date,
  texte: "Un court texte.",
  video: { id: "abcdefghijk", chaine: "LoL Esports" },
});

describe("le rangement des Moments mythiques", () => {
  it("range les Moments du plus ancien au plus récent, quel que soit l'ordre du fichier", () => {
    const rangement = ordonnerMoments([
      moment("C", "2024-11-02"),
      moment("A", "2013-08-31"),
      moment("D", "2025-11-09"),
      moment("B", "2016-10-29"),
    ]);

    expect(rangement.map((m) => m.titre)).toEqual(["A", "B", "C", "D"]);
  });

  it("ne modifie pas la liste reçue", () => {
    const entrees = [moment("B", "2016-10-29"), moment("A", "2013-08-31")];
    ordonnerMoments(entrees);

    expect(entrees.map((m) => m.titre)).toEqual(["B", "A"]);
  });
});

describe("la date lisible d'un Moment", () => {
  it("écrit la date en français, sans décalage de fuseau horaire", () => {
    expect(dateLisible("2013-08-31")).toBe("31 août 2013");
    expect(dateLisible("2025-01-01")).toBe("1 janvier 2025");
  });
});
