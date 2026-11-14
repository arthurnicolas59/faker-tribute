import { describe, expect, it } from "vitest";
import { momentMythiqueSchema } from "../src/data/moments-schema";

const valide = {
  titre: "Le duel Zed contre Zed",
  date: "2013-08-31",
  texte: "Un texte assez long pour raconter un Moment mythique de Faker.",
  video: { id: "YFCpCajop9k", chaine: "LoL Esports" },
};

describe("le schéma d'un Moment mythique", () => {
  it("accepte un Moment complet", () => {
    expect(momentMythiqueSchema.safeParse(valide).success).toBe(true);
  });

  it.each(["LoL Esports", "LCK", "T1"])("accepte la chaîne officielle %s", (chaine) => {
    expect(momentMythiqueSchema.safeParse({ ...valide, video: { ...valide.video, chaine } }).success).toBe(
      true,
    );
  });

  it.each([
    ["un titre manquant", { ...valide, titre: undefined }],
    ["un titre vide", { ...valide, titre: "  " }],
    ["une date manquante", { ...valide, date: undefined }],
    ["une date mal écrite", { ...valide, date: "31/08/2013" }],
    ["une date qui n'existe pas", { ...valide, date: "2013-02-30" }],
    ["une date avant les débuts de Faker", { ...valide, date: "2012-12-31" }],
    ["un texte manquant", { ...valide, texte: undefined }],
    ["un texte vide", { ...valide, texte: "" }],
    ["une vidéo manquante", { ...valide, video: undefined }],
    ["une vidéo sans identifiant", { ...valide, video: { chaine: "LoL Esports" } }],
    [
      "une adresse à la place de l'identifiant",
      { ...valide, video: { ...valide.video, id: "https://youtu.be/YFCpCajop9k" } },
    ],
    ["une vidéo sans chaîne", { ...valide, video: { id: "YFCpCajop9k" } }],
    ["une chaîne non officielle", { ...valide, video: { ...valide.video, chaine: "Fan de Faker" } }],
    ["un champ inconnu", { ...valide, image: "faker.jpg" }],
  ])("refuse %s", (_nom, donnee) => {
    expect(momentMythiqueSchema.safeParse(donnee).success).toBe(false);
  });
});
