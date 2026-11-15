import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/components/EnTete.astro", "utf8");

describe("le CSS du nom animé", () => {
  it("ne lance l'apparition et la pulsation que sans « réduire les animations »", () => {
    const bloc = /@media screen and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n {2}\}/.exec(css)?.[1] ?? "";
    expect(bloc).toContain("lettre-apparait");
    expect(bloc).toContain("lueur-respire");
    expect(bloc).toMatch(/infinite/);
    const horsBloc = css.replace(bloc, "");
    expect(horsBloc).not.toMatch(/animation:\s*(lettre|lueur)/);
  });

  it("coupe toute animation du nom en mode réduit", () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{[\s\S]*?animation: none/);
  });

  it("garde le nom sur une ligne et n'anime ni taille ni position", () => {
    expect(css).toMatch(/white-space: nowrap/);
    const keyframes = css.slice(css.indexOf("@keyframes"), css.indexOf(".accroche {"));
    expect(keyframes).not.toMatch(/\b(transform|margin|padding|width|height|font-size|top|left)\s*:/);
  });
});
