import { readFile } from "node:fs/promises";
import { parse } from "yaml";

/**
 * Lit le fichier du Palmarès : chaque clé YAML est une catégorie, suivie de la liste de ses
 * victoires. Comme pour le Parcours, toute erreur arrête le build au lieu d'un simple avertissement.
 * La clé est recopiée dans `categorie` pour que le schéma refuse une catégorie inconnue.
 */
export async function chargerPalmares(
  fichier: string,
): Promise<Array<{ id: string; categorie: string; victoires: unknown[] }>> {
  // `parse` refuse un fichier mal écrit et une clé en double.
  const donnees: unknown = parse(await readFile(fichier, "utf8"));
  if (donnees === null || typeof donnees !== "object" || Array.isArray(donnees)) {
    throw new Error(`${fichier} doit contenir une catégorie par clé.`);
  }
  const categories = Object.entries(donnees);
  if (categories.length === 0) {
    throw new Error(`${fichier} ne contient aucune catégorie.`);
  }
  return categories.map(([id, victoires]) => {
    if (!Array.isArray(victoires)) {
      throw new Error(`${fichier} : la catégorie « ${id} » doit être une liste de victoires.`);
    }
    return { id, categorie: id, victoires };
  });
}
