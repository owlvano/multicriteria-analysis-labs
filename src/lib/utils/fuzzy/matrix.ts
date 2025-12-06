import type { FuzzyMatrix, Triangular } from "@/types";

export function createFuzzyIdentityMatrix(n: number): FuzzyMatrix {
  const one: Triangular = { l: 1, m: 1, u: 1 };
  const m: FuzzyMatrix = [];

  for (let i = 0; i < n; i++) {
    m[i] = [];
    for (let j = 0; j < n; j++) {
      m[i][j] = { ...one };
    }
  }

  return m;
}
