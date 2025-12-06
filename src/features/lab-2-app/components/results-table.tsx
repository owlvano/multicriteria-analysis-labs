import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MarcosResult } from "@/features/lab-2-app/types";

type Props = {
  results: MarcosResult[];
};

export default function ResultsTable({ results }: Props) {
  const best = results[0];

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Результати методу Fuzzy MARCOS</h2>

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
  );
}
