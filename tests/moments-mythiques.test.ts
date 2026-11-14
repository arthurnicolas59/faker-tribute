import type { HTMLElement } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { renderPage, textOf } from "./helpers/render-page";

async function sectionMoments(): Promise<HTMLElement | null> {
  const page = await renderPage();
  return page.querySelector("#titre-moments")?.closest("section") ?? null;
}

function moments(section: HTMLElement | null): HTMLElement[] {
  return section?.querySelectorAll("article") ?? [];
}

describe("la Section Moments mythiques", () => {
  it("suit le Palmarès et ferme <main>, avec son titre <h2>", async () => {
    const page = await renderPage();

    const main = page.querySelector("body > main");
    const palmares = page.querySelector("#titre-palmares")?.closest("section");
    const section = page.querySelector("#titre-moments")?.closest("section");
    expect(section).not.toBeNull();
    expect(section?.parentNode).toBe(main);
    expect(palmares?.nextElementSibling).toBe(section);
    expect(main?.lastElementChild).toBe(section);

    const titre = section?.querySelector("h2") ?? null;
    expect(textOf(titre)).toMatch(/Moments mythiques/);
    expect(section?.getAttribute("aria-labelledby")).toBe(titre?.id);
  });

  it("présente exactement 5 Moments, chacun avec un titre, une date, un texte et une vidéo", async () => {
    const liste = moments(await sectionMoments());

    expect(liste).toHaveLength(5);
    for (const moment of liste) {
      expect(textOf(moment.querySelector("h3")).length).toBeGreaterThan(5);
      const date = moment.querySelector("time");
      expect(date?.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(textOf(date)).toMatch(/^\d{1,2}(er)? [a-zéû]+ \d{4}$/);
      expect(textOf(moment.querySelector("p")).length).toBeGreaterThan(60);
      expect(moment.querySelectorAll("iframe")).toHaveLength(1);
    }
  });

  it("range les Moments du plus ancien au plus récent, du duel de 2013 à aujourd'hui", async () => {
    const dates = moments(await sectionMoments()).map(
      (m) => m.querySelector("time")?.getAttribute("datetime") ?? "",
    );

    expect(dates[0]).toBe("2013-08-31");
    expect(dates).toEqual([...dates].sort());
    expect(new Set(dates).size).toBe(5);
  });

  it("intègre chaque vidéo depuis youtube-nocookie.com, en différé, avec un titre qui décrit le Moment", async () => {
    const liste = moments(await sectionMoments());

    const identifiants = new Set<string>();
    for (const moment of liste) {
      const video = moment.querySelector("iframe")!;
      const adresse = new URL(video.getAttribute("src") ?? "");
      expect(adresse.protocol).toBe("https:");
      expect(adresse.hostname).toBe("www.youtube-nocookie.com");
      expect(adresse.pathname).toMatch(/^\/embed\/[\w-]{11}$/);
      identifiants.add(adresse.pathname);

      expect(video.getAttribute("loading")).toBe("lazy");
      expect(video.hasAttribute("allowfullscreen")).toBe(true);
      expect(video.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
      const titre = video.getAttribute("title") ?? "";
      expect(titre).toContain(textOf(moment.querySelector("h3")));
    }
    expect(identifiants.size).toBe(5);
  });

  it("nomme sous chaque vidéo la chaîne officielle qui la publie", async () => {
    const liste = moments(await sectionMoments());

    expect(liste).toHaveLength(5);
    for (const moment of liste) {
      expect(textOf(moment.querySelector(".chaine"))).toMatch(/^Vidéo : (LoL Esports|LCK|T1)$/);
    }
  });
});
