import type { MomentMythique } from "./moments-schema";

/** Range les Moments mythiques du plus ancien au plus récent, quel que soit l'ordre du fichier. */
export function ordonnerMoments<M extends Pick<MomentMythique, "date">>(moments: M[]): M[] {
  return [...moments].sort((a, b) => a.date.localeCompare(b.date));
}

// La date est lue à midi UTC pour qu'aucun fuseau horaire ne la décale d'un jour.
const formatDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Écrit une date AAAA-MM-JJ en français : « 31 août 2013 », « 1er janvier 2025 ». */
export const dateLisible = (date: string): string =>
  formatDate.format(new Date(`${date}T12:00:00Z`)).replace(/^1 /, "1er ");
