import { describe, expect, it } from "vitest";
import { valeurCompteur } from "../src/scripts/animations";

describe("valeurCompteur", () => {
  it("part de 0 et finit exactement au total", () => {
    expect(valeurCompteur(10, 0, 1000)).toBe(0);
    expect(valeurCompteur(10, 1000, 1000)).toBe(10);
    expect(valeurCompteur(10, 5000, 1000)).toBe(10);
  });

  it("monte sans jamais dépasser le total, avec des entiers", () => {
    let precedent = 0;
    for (let t = 0; t <= 1000; t += 50) {
      const v = valeurCompteur(10, t, 1000);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(precedent);
      expect(v).toBeLessThanOrEqual(10);
      precedent = v;
    }
  });
});
