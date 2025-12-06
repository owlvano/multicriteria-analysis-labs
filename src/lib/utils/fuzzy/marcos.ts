import type { LinguisticTerm, Triangular } from "@/types";
import { addT, divT, mulTScalar } from "./math";

export function buildFuzzyMatrix(
  terms: LinguisticTerm[][],
  scale: Record<LinguisticTerm, Triangular>,
): Triangular[][] {
  return terms.map((row) => row.map((t) => scale[t]));
}

export function buildExtendedMatrix(X: Triangular[][]) {
  const m = X.length;
  const n = X[0].length;

  const aiRow: Triangular[] = [];
  const idRow: Triangular[] = [];

  for (let j = 0; j < n; j++) {
    let minL = Infinity,
      minM = Infinity,
      minU = Infinity;
    let maxL = -Infinity,
      maxM = -Infinity,
      maxU = -Infinity;

    for (let i = 0; i < m; i++) {
      const x = X[i][j];
      minL = Math.min(minL, x.l);
      minM = Math.min(minM, x.m);
      minU = Math.min(minU, x.u);

      maxL = Math.max(maxL, x.l);
      maxM = Math.max(maxM, x.m);
      maxU = Math.max(maxU, x.u);
    }

    aiRow.push({ l: minL, m: minM, u: minU });
    idRow.push({ l: maxL, m: maxM, u: maxU });
  }

  const extended = [aiRow, ...X, idRow];
  return { extended, aiRow, idRow };
}

export function normalizeMatrix(
  extended: Triangular[][],
  idRow: Triangular[],
): Triangular[][] {
  return extended.map((row) => row.map((cell, j) => divT(cell, idRow[j])));
}

export function computeEqualWeights(n: number): number[] {
  return Array(n).fill(1 / n);
}

export function applyWeights(
  matrix: Triangular[][],
  weights: number[],
): Triangular[][] {
  return matrix.map((row) =>
    row.map((cell, j) => mulTScalar(cell, weights[j])),
  );
}

export function rowSums(v: Triangular[][]): Triangular[] {
  return v.map((row) =>
    row.reduce((acc, x) => addT(acc, x), { l: 0, m: 0, u: 0 }),
  );
}

export function computeUtilityDegrees(s: number[], sAi: number, sId: number) {
  const m = s.length;
  const kMinus: number[] = [];
  const kPlus: number[] = [];
  const fMinus: number[] = [];
  const fPlus: number[] = [];
  const f: number[] = [];

  for (let i = 0; i < m; i++) {
    const Km = s[i] / sAi;
    const Kp = s[i] / sId;

    kMinus[i] = Km;
    kPlus[i] = Kp;

    const fm = Kp / (Kp + Km);
    const fp = Km / (Kp + Km);

    fMinus[i] = fm;
    fPlus[i] = fp;

    const denom = 1 + (1 - fp) / (fp || 1e-9) + (1 - fm) / (fm || 1e-9);

    f[i] = (Kp + Km) / denom;
  }

  return { kMinus, kPlus, fMinus, fPlus, f };
}

export const MARCOS_SCALE: Record<LinguisticTerm, Triangular> = {
  EP: { l: 1, m: 1, u: 1 },
  VP: { l: 1, m: 1, u: 3 },
  P: { l: 1, m: 3, u: 3 },
  MP: { l: 3, m: 3, u: 5 },
  M: { l: 3, m: 5, u: 5 },
  MG: { l: 5, m: 5, u: 7 },
  G: { l: 5, m: 7, u: 7 },
  VG: { l: 7, m: 7, u: 9 },
  EG: { l: 7, m: 9, u: 9 },
};
