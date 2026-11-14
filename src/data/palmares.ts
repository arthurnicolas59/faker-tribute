import {
  CATEGORIES_PALMARES,
  SAISONS,
  type CategoriePalmares,
  type CategoriePalmaresDonnees,
} from "./palmares-schema";

type Victoire = CategoriePalmaresDonnees["victoires"][number];

export interface CategorieAffichee {
  categorie: CategoriePalmares;
  victoires: Victoire[];
  /** Toujours le nombre de victoires : il n'est jamais saisi à la main. */
  total: number;
}

const rangSaison = (victoire: Victoire) =>
  victoire.saison === undefined ? -1 : SAISONS.indexOf(victoire.saison);

/**
 * Range le Palmarès pour l'affichage : les catégories dans l'ordre fixé par le code
 * (Worlds, MSI, LCK, Jeux asiatiques), quel que soit l'ordre du fichier, et les victoires
 * par année puis par saison. Une catégorie absente du fichier arrête le build.
 */
export function ordonnerPalmares(entrees: CategoriePalmaresDonnees[]): CategorieAffichee[] {
  return CATEGORIES_PALMARES.map((categorie) => {
    const entree = entrees.find((e) => e.categorie === categorie);
    if (entree === undefined) {
      throw new Error(`Le Palmarès doit contenir la catégorie « ${categorie} ».`);
    }
    const victoires = [...entree.victoires].sort(
      (a, b) => a.annee - b.annee || rangSaison(a) - rangSaison(b),
    );
    return { categorie, victoires, total: victoires.length };
  });
}
