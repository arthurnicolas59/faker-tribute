/**
 * Les textes fixes de la page : onglet, En-tête et Mention site de fan.
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
  mentionSiteDeFan:
    "Site de fan non officiel. Il n'a aucun lien avec Riot Games ni avec T1, et n'est ni approuvé ni soutenu par eux.",
};
