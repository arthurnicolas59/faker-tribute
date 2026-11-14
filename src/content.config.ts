import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { etapeParcoursSchema } from "./data/parcours-schema";

// Le Parcours : un fichier YAML, une étape par entrée, dans l'ordre chronologique.
const parcours = defineCollection({
  loader: file("src/content/parcours.yaml"),
  schema: etapeParcoursSchema,
});

export const collections = { parcours };
