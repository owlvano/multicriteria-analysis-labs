import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Alternative, Criterion, FuzzyMatrix } from "@/types";
import { createFuzzyIdentityMatrix } from "@/lib/utils/fuzzy/matrix";
import { defaultAlternatives, defaultCriteria } from "./data";
import { useFahp } from "./hooks/use-fahp";
import { ProblemSetupForm } from "./components/problem-setup-form";
import { PairwiseMatrixTable } from "./components/pairwise-matrix-table";
import { CriteriaWeightsView } from "./components/criteria-weights-view";
import { AlternativesWeightsView } from "./components/alternatives-weights-view";
import { FinalResultView } from "./components/final-result-view";
import {
  buildAlternativeMatrices,
  buildFuzzyMatrixFromSaaty,
  criteriaSaatyUpper,
} from "./data/defaults";
import { Button } from "@/components/ui/button";

function initAltMatrices(criteria: Criterion[], alts: Alternative[]) {
  const m: Record<string, FuzzyMatrix> = {};
  for (const c of criteria) {
    m[c.id] = createFuzzyIdentityMatrix(alts.length);
  }
  return m;
}

export default function Lab1App() {
  const [criteria, setCriteria] = useState<Criterion[]>(defaultCriteria);
  const [alternatives, setAlternatives] =
    useState<Alternative[]>(defaultAlternatives);

  const [criteriaMatrix, setCriteriaMatrix] = useState<FuzzyMatrix>(() =>
    createFuzzyIdentityMatrix(defaultCriteria.length),
  );

  const [altMatrices, setAltMatrices] = useState<Record<string, FuzzyMatrix>>(
    () => initAltMatrices(defaultCriteria, defaultAlternatives),
  );

  const [tab, setTab] = useState("setup");

  const newLocal = useFahp(criteria, alternatives, criteriaMatrix, altMatrices);
  const { criteriaWeights, altWeightsByCriterion, scores } = newLocal;

  const criteriaM = useMemo(
    () => criteriaWeights.map((w) => w.M),
    [criteriaWeights],
  );
  const criteriaN = useMemo(
    () => criteriaWeights.map((w) => w.N),
    [criteriaWeights],
  );

  const altViewItems = useMemo(
    () =>
      criteria.map((c, ci) => ({
        criterionName: criteria[ci].name,
        rows: alternatives.map((a, ai) => ({
          alternativeName: a.name,
          weight: altWeightsByCriterion[c.id]?.[ai]?.N ?? 0,
        })),
      })),
    [criteria, alternatives, altWeightsByCriterion],
  );

  const finalResults = useMemo(
    () =>
      alternatives.map((a) => ({
        name: a.name,
        score: scores[a.id] ?? 0,
      })),
    [alternatives, scores],
  );

  function autoFill() {
    setCriteriaMatrix(buildFuzzyMatrixFromSaaty(criteriaSaatyUpper));
    setAltMatrices(buildAlternativeMatrices());
  }

  function handleSetupSubmit(data: {
    criteria: string[];
    alternatives: string[];
  }) {
    const newCriteria: Criterion[] = data.criteria.map((name, i) => ({
      id: `C${i + 1}`,
      name,
    }));
    const newAlts: Alternative[] = data.alternatives.map((name, i) => ({
      id: `A${i + 1}`,
      name,
    }));

    setCriteria(newCriteria);
    setAlternatives(newAlts);
    setCriteriaMatrix(createFuzzyIdentityMatrix(newCriteria.length));
    setAltMatrices(initAltMatrices(newCriteria, newAlts));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Лабораторна робота №1 — Fuzzy AHP</h1>

      <p className="text-sm text-muted-foreground max-w-3xl">
        Мета: дослідження методу Fuzzy AHP для задач багатокритеріального
        аналізу та визначення найкращої SDR-платформи за групою критеріїв
        максимізації.
      </p>

      <Tabs
        defaultValue="setup"
        value={tab}
        onValueChange={setTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="setup">1. Постановка задачі</TabsTrigger>
          <TabsTrigger value="criteria">2. Критерії</TabsTrigger>
          <TabsTrigger value="alternatives">3. Альтернативи</TabsTrigger>
          <TabsTrigger value="results">4. Результати</TabsTrigger>
        </TabsList>

        {tab !== "setup" && (
          <div className="flex gap-3">
            <Button onClick={autoFill}>Автозаповнити матриці</Button>
          </div>
        )}

        <TabsContent value="setup">
          <ProblemSetupForm
            initialCriteria={criteria.map((c) => c.name)}
            initialAlternatives={alternatives.map((a) => a.name)}
            onSubmit={handleSetupSubmit}
            onNext={() => setTab("criteria")}
          />
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <PairwiseMatrixTable
            labels={criteria.map((c) => c.name)}
            value={criteriaMatrix}
            onChange={setCriteriaMatrix}
            title="Попарні порівняння критеріїв"
          />
          <CriteriaWeightsView
            criteriaNames={criteria.map((c) => c.name)}
            M={criteriaM}
            N={criteriaN}
          />
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-4">
          {criteria.map((c) => (
            <PairwiseMatrixTable
              key={c.id}
              labels={alternatives.map((a) => a.name)}
              value={altMatrices[c.id]}
              onChange={(m) =>
                setAltMatrices((prev) => ({
                  ...prev,
                  [c.id]: m,
                }))
              }
              title={`Попарні порівняння альтернатив за критерієм: ${c.name}`}
            />
          ))}

          <AlternativesWeightsView items={altViewItems} />
        </TabsContent>

        <TabsContent value="results">
          <FinalResultView results={finalResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
