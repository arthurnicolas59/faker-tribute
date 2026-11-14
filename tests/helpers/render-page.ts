import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import Page from "../../src/pages/index.astro";

/**
 * Rend la page complète, comme le visiteur la reçoit, et renvoie son HTML analysé.
 * Les tests des Sections partent de là : `const page = await renderPage();`
 */
export async function renderPage(): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Page, { partial: false });
  return parse(html);
}

/** Le texte visible d'un élément, espaces normalisés. */
export function textOf(element: HTMLElement | null): string {
  return (element?.textContent ?? "").replace(/\s+/g, " ").trim();
}
