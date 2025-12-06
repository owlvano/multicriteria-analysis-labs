import type { FuzzyMatrix, Triangular } from "@/types";
import { fuzzySaatyScale, invertTriangular } from "@/features/lab-1-app/data";

// helper — convert Saaty integer to triangular fuzzy
function s(value: number): Triangular {
  return fuzzySaatyScale[value];
}

// авто-матриця критеріїв (upper-triangle)
export const criteriaSaatyUpper = [
  [1, 4, 3, 2, 2, 5, 4],
  [0, 1, 2, 5, 4, 6, 5],
  [0, 0, 1, 3, 4, 5, 4],
  [0, 0, 0, 1, 4, 7, 5],
  [0, 0, 0, 0, 1, 4, 3],
  [0, 0, 0, 0, 0, 1, 2],
  [0, 0, 0, 0, 0, 0, 1],
];

// авто-матриці альтернатив по кожному критерію

export const alternativesSaaty = {
  C1: [
    [1, 2, 2, 2],
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C2: [
    [1, 4, 3, 2],
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C3: [
    [1, 6, 4, 2],
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C4: [
    [1, 4, 5, 4],
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C5: [
    [1, 6, 5, 4],
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C6: [
    [1, 1, 2, 2],
    [0, 1, 3, 4],
    [0, 0, 1, 2],
    [0, 0, 0, 1],
  ],
  C7: [
    [1, 2, 2, 2],
    [0, 1, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
  ],
};

// генеруємо повноцінний fuzzy matrix з upper-triangle
export function buildFuzzyMatrixFromSaaty(upper: number[][]): FuzzyMatrix {
  const n = upper.length;
  const matrix: FuzzyMatrix = [];

  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = s(1);
      } else if (i < j) {
        matrix[i][j] = s(upper[i][j]);
      } else {
        matrix[i][j] = invertTriangular(s(upper[j][i]));
      }
    }
  }
  return matrix;
}

// конвертація альт-матриць
export function buildAlternativeMatrices(): Record<string, FuzzyMatrix> {
  const out: Record<string, FuzzyMatrix> = {};
  Object.entries(alternativesSaaty).forEach(([cid, upper]) => {
    out[cid] = buildFuzzyMatrixFromSaaty(upper);
  });
  return out;
}
