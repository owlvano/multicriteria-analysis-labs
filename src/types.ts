export type Triangular = {
  l: number;
  m: number;
  u: number;
};

export type Criterion = {
  id: string;
  name: string;
  description?: string;
};

export type Alternative = {
  id: string;
  name: string;
  description?: string;
};

// Матриця попарних порівнянь n x n
export type FuzzyMatrix = Triangular[][];

// Результати обчислень по Buckley FAHP
export type FuzzyWeight = {
  fuzzy: Triangular; // w_i
  M: number; // defuzzified
  N: number; // normalized
};

export type LinguisticTerm =
  | "EP"
  | "VP"
  | "P"
  | "MP"
  | "M"
  | "MG"
  | "G"
  | "VG"
  | "EG";
