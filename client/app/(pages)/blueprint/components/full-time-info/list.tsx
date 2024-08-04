import React from "react";
import { BluePrintType } from "@/constants/blue-print";
import { RadioGroup, RadioGroupCustomItem } from "@/components/ui/radio-group";
import { TargetCard } from "./target-card";

type TargetListProps = {
  targets: BluePrintType[];
  selectedTarget: string;
  onChange: (e: string) => void;
};

export const TargetList = ({
  targets,
  selectedTarget,
  onChange,
}: TargetListProps) => {
  return (
    <RadioGroup
      onValueChange={onChange}
      defaultValue={selectedTarget}
      className="flex-1 grid grid-cols-3 gap-2"
    >
      {targets.map((target) => (
        <RadioGroupCustomItem value={target.type!}>
          <TargetCard target={target} />
        </RadioGroupCustomItem>
      ))}
    </RadioGroup>
  );
};
