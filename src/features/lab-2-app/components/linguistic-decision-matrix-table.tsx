import { Card } from "@/components/ui/card";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ALTERNATIVES, CRITERIA } from "@/features/lab-2-app/data";
import type { LinguisticTerm } from "@/types";
import { Select, SelectValue } from "@radix-ui/react-select";


type Props = {
  terms: LinguisticTerm[][];
  updateTerm: (i: number, j: number, v: LinguisticTerm) => void;
};

export default function LinguisticDecisionMatrixTable({
  terms,
  updateTerm,
}: Props) {
  return (
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
        EP, VP, P, MP, M, MG, G, VG, EG — лінгвістичні терми, які перетворюються
        у нечіткі трикутні числа згідно шкали з методички.
      </p>
    </Card>
  );
}
