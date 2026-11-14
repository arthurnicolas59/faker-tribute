import { readFile } from "node:fs/promises";
import { parse } from "yaml";

/**
 * Lit le fichier du Parcours : chaque clé YAML est le nom d'une étape.
 * Le chargeur `file` d'Astro ne fait qu'avertir sur un fichier illisible ou un nom en double,
 * et le build passe alors avec des étapes en moins. Ici, toute erreur arrête le build.
 */
export async function chargerParcours(fichier: string): Promise<Array<{ id: string }>> {
  // `parse` refuse un fichier mal écrit et une clé en double.
  const donnees: unknown = parse(await readFile(fichier, "utf8"));
  if (donnees === null || typeof donnees !== "object" || Array.isArray(donnees)) {
    throw new Error(`${fichier} doit contenir une étape par clé.`);
  }
  const etapes = Object.entries(donnees);
  if (etapes.length === 0) {
    throw new Error(`${fichier} ne contient aucune étape.`);
  }
  return etapes.map(([id, etape]) => ({ ...(etape as object), id }));
}
