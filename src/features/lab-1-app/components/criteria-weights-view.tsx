// src/fahp/components/CriteriaWeightsView.tsx
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  criteriaNames: string[];
  M: number[];
  N: number[];
}

export function CriteriaWeightsView({ criteriaNames, M, N }: Props) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Ваги критеріїв (Fuzzy AHP)</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Критерій</TableHead>
            <TableHead>M (дефаззифік.)</TableHead>
            <TableHead>N (норм.)</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {criteriaNames.map((name, i) => (
            <TableRow key={i}>
              <TableCell>{name}</TableCell>
              <TableCell>{M[i]?.toFixed(4)}</TableCell>
              <TableCell>{N[i]?.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
