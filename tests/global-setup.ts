import { execFileSync } from "node:child_process";

/**
 * Avant les tests : `astro sync` lit les collections de contenu (le Parcours) et les range dans
 * .astro/data-store.json, d'où la page rendue les relit. Sans cette étape, elles seraient vides.
 */
export default function setup(): void {
  execFileSync("npx", ["astro", "sync"], { stdio: "inherit" });
}
