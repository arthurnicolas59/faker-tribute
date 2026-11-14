import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderPage } from "./helpers/render-page";

// Règle du projet : aucune photo ni image copiée de Faker, de T1 ou de Riot Games.
// Le visuel vient des couleurs, de la typographie et de formes CSS ou SVG faites maison.

const RACINE = fileURLToPath(new URL("..", import.meta.url));
const IMAGE_RASTER = /\.(png|jpe?g|webp|gif|avif|bmp|ico|tiff?)$/i;
// docs/ accueille les captures d'écran des briefs : ce n'est pas le site.
const DOSSIERS_IGNORES = new Set(["node_modules", "dist", ".astro", ".git", ".netlify", "docs", ".worktrees"]);

function fichiersDuProjet(dossier: string): string[] {
  return readdirSync(dossier, { withFileTypes: true }).flatMap((entree) => {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) {
      return DOSSIERS_IGNORES.has(entree.name) ? [] : fichiersDuProjet(chemin);
    }
    return [relative(RACINE, chemin)];
  });
}

describe("sans image copiée", () => {
  it("la page n'affiche aucune image", async () => {
    const page = await renderPage();

    expect(page.querySelectorAll("img, picture")).toHaveLength(0);
    expect(page.toString()).not.toMatch(/\.(png|jpe?g|webp|gif|avif)\b/i);
  });

  it("le projet ne contient aucun fichier d'image raster", () => {
    expect(fichiersDuProjet(RACINE).filter((fichier) => IMAGE_RASTER.test(fichier))).toEqual([]);
  });
});
