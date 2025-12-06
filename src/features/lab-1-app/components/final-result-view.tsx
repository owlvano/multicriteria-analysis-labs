// src/fahp/components/FinalResultView.tsx
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
  results: { name: string; score: number }[];
}

export function FinalResultView({ results }: Props) {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const best = sorted[0];

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Фінальний рейтинг альтернатив</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Альтернатива</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow
              key={r.name}
              className={r.name === best?.name ? "font-semibold" : ""}
            >
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.score.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {best && (
        <div className="text-lg font-semibold">
          Найкраща альтернатива:{" "}
          <span className="text-primary">{best.name}</span>
        </div>
      )}
    </Card>
  );
}
