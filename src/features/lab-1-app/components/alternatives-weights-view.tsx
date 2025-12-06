// src/fahp/components/AlternativesWeightsView.tsx
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AltWeightRow {
  alternativeName: string;
  weight: number;
}

interface CriterionAltWeights {
  criterionName: string;
  rows: AltWeightRow[];
}

interface Props {
  items: CriterionAltWeights[];
}

export function AlternativesWeightsView({ items }: Props) {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <Card key={idx} className="p-6 space-y-4">
          <h2 className="text-xl font-bold">
            Ваги альтернатив за критерієм: {item.criterionName}
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Альтернатива</TableHead>
                <TableHead>Вага (N)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {item.rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.alternativeName}</TableCell>
                  <TableCell>{row.weight.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
}
