import { defineCollection } from "astro:content";
import { chargerParcours } from "./data/charger-parcours";
import { etapeParcoursSchema } from "./data/parcours-schema";

const parcours = defineCollection({
  loader: () => chargerParcours("src/content/parcours.yaml"),
  schema: etapeParcoursSchema,
});

export const collections = { parcours };
