import { z } from "astro/zod";

export const ANNEE_DEBUTS = 2013;
const ANNEE_MAX = 2100;

/**
 * Le schéma d'une étape du Parcours. Il vit ici, hors de `content.config.ts`,
 * pour que les tests puissent le vérifier directement.
 * Une étape invalide (titre vide, texte vide, année hors bornes) fait échouer `astro build`.
 */
export const etapeParcoursSchema = z.object({
  annee: z.number().int().min(ANNEE_DEBUTS).max(ANNEE_MAX),
  titre: z.string().trim().min(1),
  texte: z.string().trim().min(1),
});
