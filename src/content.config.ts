import { defineCollection } from "astro:content";
import { chargerMoments } from "./data/charger-moments";
import { chargerPalmares } from "./data/charger-palmares";
import { chargerParcours } from "./data/charger-parcours";
import { momentMythiqueSchema } from "./data/moments-schema";
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

const moments = defineCollection({
  loader: () => chargerMoments("src/content/moments.yaml"),
  schema: momentMythiqueSchema,
});

export const collections = { parcours, palmares, moments };
