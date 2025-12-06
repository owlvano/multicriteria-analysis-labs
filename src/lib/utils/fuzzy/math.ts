import type { FuzzyMatrix, FuzzyWeight, Triangular } from "@/types";

export function addT(a: Triangular, b: Triangular): Triangular {
  return {
    l: a.l + b.l,
    m: a.m + b.m,
    u: a.u + b.u,
  };
}

export function mulT(a: Triangular, b: Triangular): Triangular {
  return {
    l: a.l * b.l,
    m: a.m * b.m,
    u: a.u * b.u,
  };
}

export function mulTScalar(a: Triangular, s: number): Triangular {
  return { l: a.l * s, m: a.m * s, u: a.u * s };
}

export function divT(a: Triangular, b: Triangular): Triangular {
  return {
    l: a.l / b.u,
    m: a.m / b.m,
    u: a.u / b.l,
  };
}

export function geometricMeanRow(row: Triangular[]): Triangular {
  const n = row.length;
  let prod: Triangular = { l: 1, m: 1, u: 1 };

  for (const t of row) {
    prod = mulT(prod, t);
  }

  return {
    l: Math.pow(prod.l, 1 / n),
    m: Math.pow(prod.m, 1 / n),
    u: Math.pow(prod.u, 1 / n),
  };
}

export function inverseT(t: Triangular): Triangular {
  return {
    l: 1 / t.u,
    m: 1 / t.m,
    u: 1 / t.l,
  };
}

export function defuzzifyCOA(t: Triangular): number {
  return (t.l + t.m + t.u) / 3;
}

// Buckley FAHP: матриця -> ваги
export function computeFuzzyWeights(matrix: FuzzyMatrix): FuzzyWeight[] {
  // r_i (геометричні середні рядків)
  const r: Triangular[] = matrix.map((row) => geometricMeanRow(row));

  // sum r_i
  const sr = r.reduce<Triangular>((acc, t) => addT(acc, t), {
    l: 0,
    m: 0,
    u: 0,
  });

  // (sum r_i)^(-1)
  const srInv = inverseT(sr);

  // w_i = r_i * (sum r_i)^(-1)
  const fuzzyWeights: Triangular[] = r.map((ri) => mulT(ri, srInv));

  // defuzzify
  const M = fuzzyWeights.map((w) => defuzzifyCOA(w));
  const sumM = M.reduce((s, v) => s + v, 0);
  const N = M.map((v) => v / sumM);

  return fuzzyWeights.map((fw, i) => ({
    fuzzy: fw,
    M: M[i],
    N: N[i],
  }));
}
