// src/fahp/hooks/useFahp.ts
import { useMemo } from "react";
import type { Alternative, Criterion, FuzzyMatrix, FuzzyWeight } from "@/types";
import { computeFuzzyWeights } from "@/lib/utils/fuzzy/math";

export function useFahp(
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaMatrix: FuzzyMatrix,
  alternativeMatrices: Record<string, FuzzyMatrix>, // key = criterion.id
) {
  const criteriaWeights: FuzzyWeight[] = useMemo(
    () => computeFuzzyWeights(criteriaMatrix),
    [criteriaMatrix],
  );

  const altWeightsByCriterion: Record<string, FuzzyWeight[]> = useMemo(() => {
    const res: Record<string, FuzzyWeight[]> = {};
    for (const c of criteria) {
      const m = alternativeMatrices[c.id];
      if (m) {
        res[c.id] = computeFuzzyWeights(m);
      }
    }
    return res;
  }, [alternativeMatrices, criteria]);

  const scores: Record<string, number> = useMemo(() => {
    const result: Record<string, number> = {};
    for (const alt of alternatives) {
      let sum = 0;
      criteria.forEach((c, ci) => {
        const cw = criteriaWeights[ci]?.N ?? 0;
        const altIndex = alternatives.findIndex((a) => a.id === alt.id);
        const aw = altWeightsByCriterion[c.id]?.[altIndex]?.N ?? 0;
        sum += cw * aw;
      });
      result[alt.id] = sum;
    }
    return result;
  }, [criteria, alternatives, criteriaWeights, altWeightsByCriterion]);

  return {
    criteriaWeights,
    altWeightsByCriterion,
    scores,
  };
}
