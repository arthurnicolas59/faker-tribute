import type { CategoriePalmares, Saison } from "./palmares-schema";

/**
 * Les textes fixes de la page : onglet, En-tête, titres des Sections, libellés du Palmarès
 * et des Moments mythiques, et Mention site de fan.
 * Le type sert de schéma : `astro check` refuse un texte manquant.
 */
export interface TextesDuSite {
  titreOnglet: string;
  description: string;
  enTete: {
    nom: string;
    surnom: string;
    accroche: string;
  };
  parcours: {
    titre: string;
  };
  palmares: {
    titre: string;
    /** Le nom de chaque catégorie, et l'unité de son total. */
    categories: Record<
      CategoriePalmares,
      { nom: string; unite: { singulier: string; pluriel: string } }
    >;
    saisons: Record<Saison, string>;
  };
  momentsMythiques: {
    titre: string;
    /** Le début de la ligne qui nomme la chaîne officielle sous chaque vidéo. */
    sourceVideo: string;
    /** Le début du `title` de chaque Vidéo intégrée, lu par les lecteurs d'écran. */
    titreVideo: string;
  };
  mentionSiteDeFan: string;
}

export const textesDuSite: TextesDuSite = {
  titreOnglet: "Faker, The Unkillable Demon King : site de fan",
  description:
    "Site de fan en français qui rend hommage à Faker, légende de League of Legends : son parcours, son palmarès et ses moments mythiques.",
  enTete: {
    nom: "Faker",
    surnom: "The Unkillable Demon King",
    accroche:
      "Le plus grand joueur de l'histoire de League of Legends, au sommet depuis plus de dix ans.",
  },
  parcours: {
    titre: "Le Parcours",
  },
  palmares: {
    titre: "Le Palmarès",
    categories: {
      worlds: { nom: "Worlds", unite: { singulier: "titre", pluriel: "titres" } },
      msi: { nom: "MSI", unite: { singulier: "titre", pluriel: "titres" } },
      lck: { nom: "Champion de Corée (LCK)", unite: { singulier: "titre", pluriel: "titres" } },
      "jeux-asiatiques": {
        nom: "Jeux asiatiques",
        unite: { singulier: "médaille d'or", pluriel: "médailles d'or" },
      },
    },
    saisons: {
      hiver: "Hiver",
      printemps: "Printemps",
      ete: "Été",
    },
  },
  momentsMythiques: {
    titre: "Les Moments mythiques",
    sourceVideo: "Vidéo :",
    titreVideo: "Vidéo du Moment mythique",
  },
  mentionSiteDeFan:
    "Site de fan non officiel. Il n'a aucun lien avec Riot Games ni avec T1, et n'est ni approuvé ni soutenu par eux.",
};
