import { Card, CardContent } from "@/components/ui/card";
import { BluePrintType } from "@/constants/blue-print";
import { USDollar } from "@/formulas/numbers";
import React from "react";

export const TargetList = ({ targets }: { targets: BluePrintType[] }) => {
  return (
    <div className="flex-1 grid grid-cols-3 gap-2">
      {targets.map((f) => (
        <TargetCard target={f} />
      ))}
    </div>
  );
};
const TargetCard = ({ target }: { target: BluePrintType }) => {
  return (
    <Card>
      <CardContent>
        <p className="text-center font-bold text-lg capitalize">{target.title}</p>
        <p>Calls:{target.calls}</p>
        <p>Appointments:{target.appointments}</p>
        <p>Premium: {target.premium}</p>
        <p>Premium: {USDollar.format(target.premium)}</p>
      </CardContent>
    </Card>
  );
};
