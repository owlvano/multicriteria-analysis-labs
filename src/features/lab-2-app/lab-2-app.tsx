import LinguisticDecisionMatrixTable from "@/features/lab-2-app/components/linguistic-decision-matrix-table";
import ResultsTable from "@/features/lab-2-app/components/results-table";
import type { MarcosResult } from "@/features/lab-2-app/types";
import {
  applyWeights,
  buildExtendedMatrix,
  buildFuzzyMatrix,
  computeEqualWeights,
  computeUtilityDegrees,
  MARCOS_SCALE,
  normalizeMatrix,
  rowSums,
} from "@/lib/utils/fuzzy/marcos";
import { defuzzifyCOA } from "@/lib/utils/fuzzy/math";
import type { LinguisticTerm } from "@/types";
import { useMemo, useState } from "react";
import { ALTERNATIVES, CRITERIA, DEFAULT_TERMS } from "./data";

export default function Lab2App() {
  const [terms, setTerms] = useState<LinguisticTerm[][]>(DEFAULT_TERMS);

  const fuzzyMatrix = useMemo(
    () => buildFuzzyMatrix(terms, MARCOS_SCALE),
    [terms]
  );

  const { extended, idRow } = useMemo(
    () => buildExtendedMatrix(fuzzyMatrix),
    [fuzzyMatrix]
  );

  const normalized = useMemo(
    () => normalizeMatrix(extended, idRow),
    [extended, idRow]
  );

  const weights = useMemo(() => computeEqualWeights(CRITERIA.length), []);

  const weighted = useMemo(
    () => applyWeights(normalized, weights),
    [normalized, weights]
  );

  const sTilde = useMemo(() => rowSums(weighted), [weighted]);

  // 0 – AI, 1..m – A1..Am, last – ID
  const sCrisp = useMemo(() => sTilde.map(defuzzifyCOA), [sTilde]);

  const sAi = sCrisp[0];
  const sId = sCrisp[sCrisp.length - 1];
  const sAlts = sCrisp.slice(1, sCrisp.length - 1);

  const { kMinus, kPlus, fMinus, fPlus, f } = useMemo(
    () => computeUtilityDegrees(sAlts, sAi, sId),
    [sAlts, sAi, sId]
  );

  const results: MarcosResult[] = useMemo(
    () =>
      ALTERNATIVES.map((name, i) => ({
        name,
        kMinus: kMinus[i],
        kPlus: kPlus[i],
        fMinus: fMinus[i],
        fPlus: fPlus[i],
        f: f[i],
      })).sort((a, b) => b.f - a.f),
    [kMinus, kPlus, fMinus, fPlus, f]
  );

  function updateTerm(ai: number, cj: number, value: LinguisticTerm) {
    setTerms((prev) => {
      const next = prev.map((row) => [...row]);
      next[ai][cj] = value;
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Лабораторна робота №2 — Fuzzy MARCOS
      </h1>

      <p className="text-sm text-muted-foreground max-w-3xl">
        Мета: дослідження методу Fuzzy MARCOS для задач багатокритеріального
        аналізу та визначення найкращої SDR-платформи за групою критеріїв
        максимізації.
      </p>

      <LinguisticDecisionMatrixTable terms={terms} updateTerm={(i, v, j) => updateTerm(i, v, j)} />

      <ResultsTable results={results} />
    </div>
  );
}
