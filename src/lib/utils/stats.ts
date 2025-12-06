export function computeStdDevWeights(X: number[][]): number[] {
  const m = X.length;    // rows
  const n = X[0].length; // cols

  const means = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    means[j] = X.reduce((s, row) => s + row[j], 0) / m;
  }

  const std = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    std[j] = Math.sqrt(
      X.reduce((s, row) => s + Math.pow(row[j] - means[j], 2), 0) / m
    );
  }

  const sum = std.reduce((s, v) => s + v, 0);
  return std.map(v => v / sum);
}


export function computeVarianceWeights(X: number[][]): number[] {
  const m = X.length;
  const n = X[0].length;

  const means = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    means[j] = X.reduce((s, row) => s + row[j], 0) / m;
  }

  const varr = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    varr[j] = X.reduce((s, row) => s + Math.pow(row[j] - means[j], 2), 0) / m;
  }

  const sum = varr.reduce((s, v) => s + v, 0);
  return varr.map(v => v / sum);
}


export function computeEntropyWeights(X: number[][]): number[] {
  const m = X.length;
  const n = X[0].length;

  const norm = X.map(row => {
    const rowSum = row.reduce((s, v) => s + v, 0);
    return row.map(v => v / rowSum);
  });

  const k = 1 / Math.log(m);
  const e = Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    e[j] = -k * norm.reduce((s, row) => {
      const p = row[j];
      return s + (p > 0 ? p * Math.log(p) : 0);
    }, 0);
  }

  const d = e.map(v => 1 - v);
  const sumD = d.reduce((s, v) => s + v, 0);
  return d.map(v => v / sumD);
}
