import React from "react";
import { BluePrintType } from "@/constants/blue-print";
import { RadioGroup, RadioGroupCustomItem } from "@/components/ui/radio-group";
import { TargetCard } from "./target-card";

type TargetListProps = {
  targets: BluePrintType[];
  selectedTarget: string;
  loading: boolean;
  onChange: (e: string) => void;
};

export const TargetList = ({
  targets,
  selectedTarget,
  loading,
  onChange,
}: TargetListProps) => {
  return (
    <RadioGroup
      onValueChange={onChange}
      defaultValue={selectedTarget}
      className="flex-1 grid grid-cols-3 gap-2"
      disabled={loading}
    >
      {targets.map((target) => (
        <RadioGroupCustomItem key={target.type} value={target.type!}>
          <TargetCard target={target} />
        </RadioGroupCustomItem>
      ))}
    </RadioGroup>
  );
};
