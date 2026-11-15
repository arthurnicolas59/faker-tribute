import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const composant = readFileSync("src/components/EnTete.astro", "utf8");
const styles = /<style>([\s\S]*?)<\/style>/.exec(composant)?.[1] ?? "";

/** Le contenu d'une règle `selecteur { … }` de premier niveau, sans les règles imbriquées. */
function regle(selecteur: string): string {
  const debut = styles.indexOf(`\n  ${selecteur} {`);
  return debut === -1 ? "" : styles.slice(debut, styles.indexOf("\n  }", debut));
}

/** Les ombres d'une déclaration text-shadow, espaces normalisés. */
function ombre(bloc: string): string {
  return (/text-shadow:([\s\S]*?);/.exec(bloc)?.[1] ?? "").replace(/\s+/g, " ").trim();
}

describe("le CSS du nom animé", () => {
  it("ne lance l'apparition et la pulsation que sans « réduire les animations »", () => {
    const bloc =
      /@media screen and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n {2}\}/.exec(
        styles,
      )?.[1] ?? "";
    expect(bloc).toContain("lettre-apparait");
    expect(bloc).toContain("lueur-respire");
    expect(bloc).toMatch(/infinite/);
    const horsBloc = styles.replace(bloc, "");
    expect(horsBloc).not.toMatch(/animation:\s*(lettre|lueur)/);
  });

  it("coupe toute animation du nom en mode réduit", () => {
    expect(styles).toMatch(/prefers-reduced-motion: reduce\) \{[\s\S]*?animation: none/);
  });

  it("garde le nom sur une ligne et n'anime ni taille ni position", () => {
    expect(regle(".nom")).toMatch(/white-space: nowrap/);
    const keyframes = [...styles.matchAll(/@keyframes[\s\S]*?\n {2}\}/g)].join("\n");
    expect(keyframes).toContain("lueur-respire");
    expect(keyframes).not.toMatch(
      /\b(transform|margin|padding|width|height|font-size|top|left)\s*:/,
    );
  });

  it("fait partir la pulsation de la lueur de base, sans saut quand elle démarre", () => {
    const base = ombre(regle(".nom"));
    const depart = /@keyframes lueur-respire \{[\s\S]*?0%,\s*100% \{([\s\S]*?)\}/.exec(styles)?.[1];
    expect(base).not.toBe("");
    expect(ombre(depart ?? "")).toBe(base);
  });
});
