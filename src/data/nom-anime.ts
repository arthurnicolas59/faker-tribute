/** Durée d'apparition d'une lettre, en secondes. */
export const DUREE_APPARITION_LETTRE_S = 0.5;
/** Le nom doit être entièrement visible au bout de ce temps, en secondes. La lueur pulse ensuite. */
export const DUREE_MAX_NOM_S = 1.5;
/** Écart voulu entre deux lettres, en secondes. */
const PAS_S = 0.18;

/** Les lettres du nom telles qu'on les voit : un accent composé reste avec sa lettre. */
export function lettresDuNom(nom: string): string[] {
  const decoupe = new Intl.Segmenter("fr", { granularity: "grapheme" });
  return Array.from(decoupe.segment(nom), ({ segment }) => segment);
}

/**
 * Le délai de départ de chaque lettre, en secondes. Il croît d'une lettre à l'autre
 * et la dernière lettre finit toujours avant `DUREE_MAX_NOM_S`.
 */
export function delaisApparition(nombreDeLettres: number): number[] {
  if (nombreDeLettres <= 0) return [];
  const pas =
    nombreDeLettres > 1
      ? Math.min(PAS_S, (DUREE_MAX_NOM_S - DUREE_APPARITION_LETTRE_S) / (nombreDeLettres - 1))
      : 0;
  return Array.from({ length: nombreDeLettres }, (_, i) => Math.round(i * pas * 1000) / 1000);
}
