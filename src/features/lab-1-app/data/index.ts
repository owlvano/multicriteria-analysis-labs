import type { Alternative, Criterion, Triangular } from "@/types";

// Твоя задача: SDR-платформи для RFML

export const defaultCriteria: Criterion[] = [
  { id: "C1", name: "Робочий діапазон частот" },
  { id: "C2", name: "Макс. смуга / частота дискретизації" },
  { id: "C3", name: "Динамічний діапазон / розрядність АЦП" },
  { id: "C4", name: "Підтримка ПЗ та екосистема" },
  { id: "C5", name: "Надійність і якість апаратури" },
  { id: "C6", name: "Вартість" },
  { id: "C7", name: "Портативність та енергоспоживання" },
];

export const defaultAlternatives: Alternative[] = [
  { id: "A1", name: "USRP B200 mini" },
  { id: "A2", name: "HackRF One" },
  { id: "A3", name: "AntSDR E200" },
  { id: "A4", name: "bladeRF 2.0 micro XA4" },
];

// Fuzzy Saaty scale (приклад, можна коригувати)
export const fuzzySaatyScale: Record<number, Triangular> = {
  1: { l: 1, m: 1, u: 1 },
  2: { l: 1, m: 2, u: 3 },
  3: { l: 2, m: 3, u: 4 },
  4: { l: 3, m: 4, u: 5 },
  5: { l: 4, m: 5, u: 6 },
  6: { l: 5, m: 6, u: 7 },
  7: { l: 6, m: 7, u: 8 },
  8: { l: 7, m: 8, u: 9 },
  9: { l: 9, m: 9, u: 9 },
};

export function invertTriangular(t: Triangular): Triangular {
  return {
    l: 1 / t.u,
    m: 1 / t.m,
    u: 1 / t.l,
  };
}
