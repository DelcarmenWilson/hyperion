"use client";
import { cn } from "@/lib/utils";
import { ConditionCard } from "./card";
import { FullLeadMedicalCondition } from "@/types";

type ConditionsListProps = {
  conditions: FullLeadMedicalCondition[];
  size?: string;
};
export const ConditionsList = ({
  conditions,
  size = "full",
}: ConditionsListProps) => {
  return (
    <>
      {conditions.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {conditions.map((condition) => (
            <ConditionCard key={condition.id} condition={condition} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Conditions Found</p>
        </div>
      )}
    </>
  );
};
