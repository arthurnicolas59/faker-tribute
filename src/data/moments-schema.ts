import { z } from "astro/zod";
import { ANNEE_DEBUTS } from "./parcours-schema";

/** Les seules chaînes YouTube dont la page accepte une Vidéo intégrée. */
export const CHAINES_OFFICIELLES = ["LoL Esports", "LCK", "T1"] as const;

const DATE_DEBUTS = `${ANNEE_DEBUTS}-01-01`;
const DATE_MAX = "2100-12-31";

/** Une date réelle, écrite AAAA-MM-JJ : « 2013-02-30 » est refusée. */
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La date s'écrit AAAA-MM-JJ.")
  .refine((date) => {
    const jour = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(jour.getTime()) && jour.toISOString().startsWith(date);
  }, "Cette date n'existe pas.")
  .refine((date) => date >= DATE_DEBUTS && date <= DATE_MAX, "La date est hors bornes.");

/**
 * Le schéma d'un Moment mythique. Il vit ici, hors de `content.config.ts`,
 * pour que les tests puissent le vérifier directement.
 * Un Moment incomplet (sans titre, date, texte, identifiant de vidéo ou chaîne officielle)
 * fait échouer `astro build`.
 */
export const momentMythiqueSchema = z.strictObject({
  // Astro transmet aussi le nom de l'entrée ; toute autre clé (une image, par exemple) est refusée.
  id: z.string().optional(),
  titre: z.string().trim().min(1),
  date: dateSchema,
  texte: z.string().trim().min(1),
  video: z.strictObject({
    // L'identifiant YouTube seul (11 caractères), jamais une adresse complète.
    id: z.string().regex(/^[\w-]{11}$/, "L'identifiant YouTube a 11 caractères."),
    chaine: z.enum(CHAINES_OFFICIELLES),
  }),
});

export type MomentMythique = z.infer<typeof momentMythiqueSchema>;
