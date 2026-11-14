import { z } from "astro/zod";
import { ANNEE_DEBUTS } from "./parcours-schema";

const ANNEE_MAX = 2100;

/** Les catégories du Palmarès, dans l'ordre où la page les affiche. */
export const CATEGORIES_PALMARES = ["worlds", "msi", "lck", "jeux-asiatiques"] as const;
export type CategoriePalmares = (typeof CATEGORIES_PALMARES)[number];

/** Les saisons de la LCK, dans l'ordre d'une année. */
export const SAISONS = ["hiver", "printemps", "ete"] as const;
export type Saison = (typeof SAISONS)[number];

const victoireSchema = z.strictObject({
  annee: z.number().int().min(ANNEE_DEBUTS).max(ANNEE_MAX),
  saison: z.enum(SAISONS).optional(),
  lieu: z.string().trim().min(1).optional(),
});

/**
 * Le schéma d'une catégorie du Palmarès et de ses victoires. Il n'y a pas de total :
 * la page le déduit du nombre de victoires. Une catégorie inconnue, une année hors bornes,
 * un titre LCK sans saison, une saison hors LCK
 * ou une victoire en double fait échouer `astro build`.
 */
export const categoriePalmaresSchema = z
  .strictObject({
    // Astro transmet aussi le nom de l'entrée ; toute autre clé (un `total`, par exemple) est refusée.
    id: z.string().optional(),
    categorie: z.enum(CATEGORIES_PALMARES),
    victoires: z.array(victoireSchema).min(1),
  })
  .superRefine(({ categorie, victoires }, ctx) => {
    const vues = new Set<string>();
    victoires.forEach((victoire, index) => {
      if (categorie === "lck" && victoire.saison === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["victoires", index, "saison"],
          message: "Un titre LCK doit indiquer sa saison (hiver, printemps ou ete).",
        });
      }
      if (categorie !== "lck" && victoire.saison !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["victoires", index, "saison"],
          message: "Seuls les titres LCK ont une saison.",
        });
      }
      const cle = `${victoire.annee}-${victoire.saison ?? ""}`;
      if (vues.has(cle)) {
        ctx.addIssue({
          code: "custom",
          path: ["victoires", index],
          message: `La victoire ${cle} est en double.`,
        });
      }
      vues.add(cle);
    });
  });

export type CategoriePalmaresDonnees = z.infer<typeof categoriePalmaresSchema>;
