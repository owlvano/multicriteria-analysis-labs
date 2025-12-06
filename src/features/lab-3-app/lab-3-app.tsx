import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  applyWeights,
  buildExtendedMatrix,
  buildFuzzyMatrix,
  computeUtilityDegrees,
  MARCOS_SCALE,
  normalizeMatrix,
  rowSums,
} from "@/lib/utils/fuzzy/marcos";
import { defuzzifyCOA } from "@/lib/utils/fuzzy/math";
import type { LinguisticTerm } from "@/types";
import { ALTERNATIVES, CRITERIA, DEFAULT_TERMS } from "./data";
import { computeEntropyWeights, computeStdDevWeights, computeVarianceWeights } from "@/lib/utils/stats";

// ---------- Типи для результатів ----------

type MethodKey = "std" | "var" | "ent";

interface MethodResult {
  key: MethodKey;
  label: string;
  weights: number[];
  scores: Record<
    string,
    {
      f: number;
      rank: number;
    }
  >;
  bestName: string;
}

export default function Lab3App() {
  const [terms, setTerms] = useState<LinguisticTerm[][]>(DEFAULT_TERMS);

  // 1) Fuzzy decision matrix (тільки альтернативи)
  const fuzzyMatrix = useMemo(
    () => buildFuzzyMatrix(terms, MARCOS_SCALE),
    [terms]
  );

  // 2) Crisp decision matrix для статистичних ваг
  const crispMatrix = useMemo(
    () => fuzzyMatrix.map((row) => row.map(defuzzifyCOA)),
    [fuzzyMatrix]
  );

  // 3) Extended + normalized (той самий для всіх методів ваг)
  const { extended, idRow } = useMemo(
    () => buildExtendedMatrix(fuzzyMatrix),
    [fuzzyMatrix]
  );

  const normalized = useMemo(
    () => normalizeMatrix(extended, idRow),
    [extended, idRow]
  );

  // 4) Обчислення ваг різними методами
  const stdWeights = useMemo(
    () => computeStdDevWeights(crispMatrix),
    [crispMatrix]
  );
  const varWeights = useMemo(
    () => computeVarianceWeights(crispMatrix),
    [crispMatrix]
  );
  const entWeights = useMemo(
    () => computeEntropyWeights(crispMatrix),
    [crispMatrix]
  );

  // 5) Запуск Fuzzy MARCOS для кожного набору ваг
  const methodResults = useMemo<MethodResult[]>(() => {
    const methods: { key: MethodKey; label: string; weights: number[] }[] = [
      { key: "std", label: "Стандартне відхилення", weights: stdWeights },
      { key: "var", label: "Дисперсія", weights: varWeights },
      { key: "ent", label: "Ентропія", weights: entWeights },
    ];

    const results: MethodResult[] = [];

    for (const m of methods) {
      if (!m.weights.length) continue;

      const weighted = applyWeights(normalized, m.weights);
      const sTilde = rowSums(weighted);
      const sCrisp = sTilde.map(defuzzifyCOA);

      // 0 – AI, 1..m – alternatives, last – ID
      const sAi = sCrisp[0];
      const sId = sCrisp[sCrisp.length - 1];
      const sAlts = sCrisp.slice(1, sCrisp.length - 1);

      const { f } = computeUtilityDegrees(sAlts, sAi, sId);

      // формуємо список та ранги
      const altList = ALTERNATIVES.map((name, i) => ({
        name,
        f: f[i],
      })).sort((a, b) => b.f - a.f);

      const scores: MethodResult["scores"] = {};
      altList.forEach((r, idx) => {
        scores[r.name] = {
          f: r.f,
          rank: idx + 1,
        };
      });

      results.push({
        key: m.key,
        label: m.label,
        weights: m.weights,
        scores,
        bestName: altList[0]?.name ?? "",
      });
    }

    return results;
  }, [normalized, stdWeights, varWeights, entWeights]);

  const bestStd = methodResults.find((m) => m.key === "std");
  const bestVar = methodResults.find((m) => m.key === "var");
  const bestEnt = methodResults.find((m) => m.key === "ent");

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
        Лабораторна робота №3 — Об’єктивні ваги критеріїв та Fuzzy MARCOS
      </h1>

      <p className="text-sm text-muted-foreground max-w-3xl">
        Мета: дослідити методи визначення ваг критеріїв (стандартне відхилення,
        дисперсія, ентропія) на основі матриці прийняття рішень та порівняти
        результати ранжування альтернатив методом Fuzzy MARCOS.
      </p>

      {/* 1. Лінгвістична матриця прийняття рішень (та сама, що й у ЛР2) */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          Лінгвістична матриця прийняття рішень
        </h2>

        <div className="overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40 whitespace-normal wrap-break-word">
                  Альтернатива
                </TableHead>
                {CRITERIA.map((c, j) => (
                  <TableHead
                    key={j}
                    className="max-w-[180px] whitespace-normal wrap-break-word text-center"
                  >
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALTERNATIVES.map((alt, i) => (
                <TableRow key={alt}>
                  <TableHead className="whitespace-normal wrap-break-word">
                    {alt}
                  </TableHead>
                  {CRITERIA.map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Select
                        value={terms[i][j]}
                        onValueChange={(v) =>
                          updateTerm(i, j, v as LinguisticTerm)
                        }
                      >
                        <SelectTrigger className="w-[90px] mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EP">EP</SelectItem>
                          <SelectItem value="VP">VP</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                          <SelectItem value="MP">MP</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="VG">VG</SelectItem>
                          <SelectItem value="EG">EG</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          EP, VP, P, MP, M, MG, G, VG, EG — лінгвістичні терми, що
          перетворюються в нечіткі трикутні числа згідно шкали з методичних
          матеріалів. На основі цієї матриці обчислюються об’єктивні ваги
          критеріїв.
        </p>
      </Card>

      {/* 2. Ваги критеріїв для кожного методу */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Ваги критеріїв</h2>
        <p className="text-sm text-muted-foreground">
          Ваги \( w_j \) обчислено трьома методами: стандартного відхилення,
          дисперсії та ентропії на основі дефаззифікованої матриці прийняття
          рішень.
        </p>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Критерій</TableHead>
                <TableHead>Std dev</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Entropy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRITERIA.map((c, j) => (
                <TableRow key={j}>
                  <TableCell className="whitespace-normal wrap-break-word max-w-[220px]">
                    {c}
                  </TableCell>
                  <TableCell>
                    {stdWeights[j] !== undefined
                      ? stdWeights[j].toFixed(3)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {varWeights[j] !== undefined
                      ? varWeights[j].toFixed(3)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {entWeights[j] !== undefined
                      ? entWeights[j].toFixed(3)
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 3. Рейтинг альтернатив для кожного методу ваг */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          Рейтинг альтернатив (Fuzzy MARCOS)
        </h2>
        <p className="text-sm text-muted-foreground">
          Для кожного методу визначення ваг критеріїв виконано повторне
          ранжування альтернатив методом Fuzzy MARCOS. У таблиці наведено
          значення функції корисності f(K) та місце в рейтингу.
        </p>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Альтернатива</TableHead>
                <TableHead>f(K), Std dev</TableHead>
                <TableHead>Ранг (Std)</TableHead>
                <TableHead>f(K), Variance</TableHead>
                <TableHead>Ранг (Var)</TableHead>
                <TableHead>f(K), Entropy</TableHead>
                <TableHead>Ранг (Ent)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALTERNATIVES.map((alt) => {
                const std = bestStd?.scores[alt];
                const v = bestVar?.scores[alt];
                const e = bestEnt?.scores[alt];

                const isBestStd = bestStd?.bestName === alt;
                const isBestVar = bestVar?.bestName === alt;
                const isBestEnt = bestEnt?.bestName === alt;

                const highlight =
                  isBestStd || isBestVar || isBestEnt
                    ? "bg-muted/40 font-semibold"
                    : "";

                return (
                  <TableRow key={alt} className={highlight}>
                    <TableCell>{alt}</TableCell>
                    <TableCell>
                      {std ? std.f.toFixed(3) : "-"}
                    </TableCell>
                    <TableCell>{std ? std.rank : "-"}</TableCell>
                    <TableCell>{v ? v.f.toFixed(3) : "-"}</TableCell>
                    <TableCell>{v ? v.rank : "-"}</TableCell>
                    <TableCell>{e ? e.f.toFixed(3) : "-"}</TableCell>
                    <TableCell>{e ? e.rank : "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          {bestStd && (
            <p>
              Найкраща альтернатива за методом ваг стандартного відхилення:{" "}
              <span className="font-semibold text-foreground">
                {bestStd.bestName}
              </span>
            </p>
          )}
          {bestVar && (
            <p>
              Найкраща альтернатива за методом ваг дисперсії:{" "}
              <span className="font-semibold text-foreground">
                {bestVar.bestName}
              </span>
            </p>
          )}
          {bestEnt && (
            <p>
              Найкраща альтернатива за методом ваг ентропії:{" "}
              <span className="font-semibold text-foreground">
                {bestEnt.bestName}
              </span>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
