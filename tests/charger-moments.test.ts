import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chargerMoments } from "../src/data/charger-moments";

function fichier(contenu: string): string {
  const chemin = join(mkdtempSync(join(tmpdir(), "moments-")), "moments.yaml");
  writeFileSync(chemin, contenu);
  return chemin;
}

const moment = (nom: string) =>
  `${nom}:\n  titre: Titre\n  date: 2013-08-31\n  texte: Texte\n  video:\n    id: YFCpCajop9k\n    chaine: LoL Esports\n`;
const moments = (n: number) =>
  Array.from({ length: n }, (_, i) => moment(`moment-${i + 1}`)).join("");

describe("la lecture du fichier des Moments mythiques", () => {
  it("donne un Moment par clé, dans l'ordre du fichier, avec la clé comme nom", async () => {
    const lus = await chargerMoments(fichier(moments(5)));

    expect(lus.map((m) => m.id)).toEqual([
      "moment-1",
      "moment-2",
      "moment-3",
      "moment-4",
      "moment-5",
    ]);
    expect(lus[0]).toEqual({
      id: "moment-1",
      titre: "Titre",
      date: "2013-08-31",
      texte: "Texte",
      video: { id: "YFCpCajop9k", chaine: "LoL Esports" },
    });
  });

  it.each([
    ["quatre Moments", moments(4)],
    ["six Moments", moments(6)],
    ["un fichier sans Moment", "# rien\n"],
    ["deux Moments du même nom", moments(4) + moment("moment-1")],
    ["une liste au lieu de Moments nommés", `- titre: T\n  date: 2013-08-31\n`],
    ["un Moment réduit à un texte", moments(4) + "moment-5: juste un texte\n"],
    ["un fichier mal écrit", `zed:\n  titre: T\n date: décalée\n`],
  ])("refuse %s", async (_nom, contenu) => {
    await expect(chargerMoments(fichier(contenu))).rejects.toThrow();
  });
});
