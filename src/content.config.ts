import { defineCollection } from "astro:content";
import { chargerPalmares } from "./data/charger-palmares";
import { chargerParcours } from "./data/charger-parcours";
import { categoriePalmaresSchema } from "./data/palmares-schema";
import { etapeParcoursSchema } from "./data/parcours-schema";

const parcours = defineCollection({
  loader: () => chargerParcours("src/content/parcours.yaml"),
  schema: etapeParcoursSchema,
});

const palmares = defineCollection({
  loader: () => chargerPalmares("src/content/palmares.yaml"),
  schema: categoriePalmaresSchema,
});

export const collections = { parcours, palmares };
