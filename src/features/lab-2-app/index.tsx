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
    [terms],
  );

  const { extended, idRow } = useMemo(
    () => buildExtendedMatrix(fuzzyMatrix),
    [fuzzyMatrix],
  );

  const normalized = useMemo(
    () => normalizeMatrix(extended, idRow),
    [extended, idRow],
  );

  const weights = useMemo(() => computeEqualWeights(CRITERIA.length), []);

  const weighted = useMemo(
    () => applyWeights(normalized, weights),
    [normalized, weights],
  );

  const sTilde = useMemo(() => rowSums(weighted), [weighted]);

  // 0 – AI, 1..m – A1..Am, last – ID
  const sCrisp = useMemo(() => sTilde.map(defuzzifyCOA), [sTilde]);

  const sAi = sCrisp[0];
  const sId = sCrisp[sCrisp.length - 1];
  const sAlts = sCrisp.slice(1, sCrisp.length - 1);

  const { kMinus, kPlus, fMinus, fPlus, f } = useMemo(
    () => computeUtilityDegrees(sAlts, sAi, sId),
    [sAlts, sAi, sId],
  );

  const results = useMemo(
    () =>
      ALTERNATIVES.map((name, i) => ({
        name,
        kMinus: kMinus[i],
        kPlus: kPlus[i],
        fMinus: fMinus[i],
        fPlus: fPlus[i],
        f: f[i],
      })).sort((a, b) => b.f - a.f),
    [kMinus, kPlus, fMinus, fPlus, f],
  );

  const best = results[0];

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

      {/* Матриця прийняття рішень (лінгвістична) */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          Лінгвістична матриця прийняття рішень
        </h2>

        <div className="overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40 wrap-break-word">
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
          EP, VP, P, MP, M, MG, G, VG, EG — лінгвістичні терми, які
          перетворюються у нечіткі трикутні числа згідно шкали з методички.
        </p>
      </Card>

      {/* Підсумкові результати MARCOS */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          Результати методу Fuzzy MARCOS
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Альтернатива</TableHead>
              <TableHead>K⁻</TableHead>
              <TableHead>K⁺</TableHead>
              <TableHead>f(K⁻)</TableHead>
              <TableHead>f(K⁺)</TableHead>
              <TableHead>f(K)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r) => (
              <TableRow
                key={r.name}
                className={
                  r.name === best?.name ? "font-semibold bg-muted/40" : ""
                }
              >
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.kMinus.toFixed(3)}</TableCell>
                <TableCell>{r.kPlus.toFixed(3)}</TableCell>
                <TableCell>{r.fMinus.toFixed(3)}</TableCell>
                <TableCell>{r.fPlus.toFixed(3)}</TableCell>
                <TableCell>{r.f.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {best && (
          <p className="text-lg font-semibold">
            Найкраща альтернатива за методом Fuzzy MARCOS:&nbsp;
            <span className="text-primary">{best.name}</span>
          </p>
        )}
      </Card>
    </div>
  );
}
