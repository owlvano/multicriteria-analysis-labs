// src/fahp/components/ProblemSetupForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  initialCriteria: string[];
  initialAlternatives: string[];
  onSubmit: (data: { criteria: string[]; alternatives: string[] }) => void;
  onNext: () => void;
}

export function ProblemSetupForm({
  initialCriteria,
  initialAlternatives,
  onSubmit,
  onNext,
}: Props) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [alternatives, setAlternatives] = useState(initialAlternatives);

  function updateCriteria(i: number, val: string) {
    const arr = [...criteria];
    arr[i] = val;
    setCriteria(arr);
  }

  function updateAlternative(i: number, val: string) {
    const arr = [...alternatives];
    arr[i] = val;
    setAlternatives(arr);
  }

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Налаштування задачі</h2>

      <div className="space-y-2">
        <h3 className="font-semibold">Критерії (2-й рівень)</h3>
        {criteria.map((c, i) => (
          <Input
            key={i}
            value={c}
            onChange={(e) => updateCriteria(i, e.target.value)}
          />
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Альтернативи (3-й рівень)</h3>
        {alternatives.map((a, i) => (
          <Input
            key={i}
            value={a}
            onChange={(e) => updateAlternative(i, e.target.value)}
          />
        ))}
      </div>

      <Button
        onClick={() => {
          onSubmit({ criteria, alternatives });
          onNext();
        }}
      >
        Зберегти та продовжити
      </Button>
    </Card>
  );
}
