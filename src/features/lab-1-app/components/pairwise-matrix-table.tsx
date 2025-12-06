// src/fahp/components/PairwiseMatrixTable.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FuzzyMatrix, Triangular } from "@/types";
import { fuzzySaatyScale, invertTriangular } from "@/features/lab-1-app/data";

interface Props {
  labels: string[];
  value: FuzzyMatrix;
  onChange: (m: FuzzyMatrix) => void;
  title?: string;
  onNext?: () => void;
}

export function PairwiseMatrixTable({
  labels,
  value,
  onChange,
  title,
  onNext,
}: Props) {
  const [matrix, setMatrix] = useState<FuzzyMatrix>(value);

  useEffect(() => {
    setMatrix(value);
  }, [value]);

  function cloneMatrix(m: FuzzyMatrix): FuzzyMatrix {
    return m.map((row) => row.map((cell) => ({ ...cell })));
  }

  function updateCell(i: number, j: number, saatyVal: number) {
    const newM = cloneMatrix(matrix);
    const t = fuzzySaatyScale[saatyVal];
    const inv = invertTriangular(t);

    newM[i][j] = { ...t };
    newM[j][i] = { ...inv };

    setMatrix(newM);
    onChange(newM);
  }

  function getSaatyFromTriangular(t: Triangular): string | undefined {
    const entry = Object.entries(fuzzySaatyScale).find(
      ([, x]) => x.l === t.l && x.m === t.m && x.u === t.u,
    );
    return entry?.[0];
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {title ?? "Матриця попарних порівнянь"}
        </h2>
        {onNext && (
          <Button variant="outline" onClick={onNext}>
            Далі
          </Button>
        )}
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              {labels.map((l, i) => (
                <TableHead
                  key={i}
                  className="font-bold text-center whitespace-normal"
                >
                  {l}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {labels.map((rowLabel, i) => (
              <TableRow key={i}>
                <TableHead className="font-bold">{rowLabel}</TableHead>
                {labels.map((_, j) => {
                  if (i === j) {
                    return (
                      <TableCell
                        key={j}
                        className="text-center text-muted-foreground"
                      >
                        1
                      </TableCell>
                    );
                  }

                  const editable = i < j;
                  const t = matrix[i][j];

                  if (editable) {
                    const current = getSaatyFromTriangular(t);
                    return (
                      <TableCell key={j} className="min-w-20">
                        <Select
                          value={current}
                          onValueChange={(val) => updateCell(i, j, Number(val))}
                        >
                          <SelectTrigger className="mx-auto">
                            <SelectValue placeholder="..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(fuzzySaatyScale).map((k) => (
                              <SelectItem key={k} value={k}>
                                {k}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={j} className="text-xs text-center">
                      ({t.l.toFixed(2)}, {t.m.toFixed(2)}, {t.u.toFixed(2)})
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
