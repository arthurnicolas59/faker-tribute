// @ts-check
import { defineConfig } from "astro/config";

// Site statique : `astro build` écrit la page dans dist/, que Netlify publie.
// cacheDir : le Parcours est lu depuis .astro/data-store.json, aussi bien par le build
// que par les tests (voir tests/global-setup.ts). Ce dossier n'est pas versionné.
export default defineConfig({
  cacheDir: "./.astro",
});
