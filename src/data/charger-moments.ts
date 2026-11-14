import { readFile } from "node:fs/promises";
import { parse } from "yaml";

/** La page présente exactement ce nombre de Moments mythiques. */
export const NOMBRE_MOMENTS = 5;

/**
 * Lit le fichier des Moments mythiques : chaque clé YAML est le nom d'un Moment.
 * Comme pour le Parcours, toute erreur arrête le build au lieu d'un simple avertissement,
 * et un fichier qui n'a pas exactement 5 Moments aussi.
 */
export async function chargerMoments(fichier: string): Promise<Array<{ id: string }>> {
  // `parse` refuse un fichier mal écrit et une clé en double.
  const donnees: unknown = parse(await readFile(fichier, "utf8"));
  if (donnees === null || typeof donnees !== "object" || Array.isArray(donnees)) {
    throw new Error(`${fichier} doit contenir un Moment mythique par clé.`);
  }
  const moments = Object.entries(donnees);
  if (moments.length !== NOMBRE_MOMENTS) {
    throw new Error(
      `${fichier} doit contenir exactement ${NOMBRE_MOMENTS} Moments mythiques, pas ${moments.length}.`,
    );
  }
  return moments.map(([id, moment]) => {
    if (moment === null || typeof moment !== "object" || Array.isArray(moment)) {
      throw new Error(
        `${fichier} : le Moment « ${id} » doit avoir un titre, une date, un texte et une vidéo.`,
      );
    }
    return { ...moment, id };
  });
}
