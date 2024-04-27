"use client";
import { ConditionCard } from "./card";
import { FullLeadMedicalCondition } from "@/types";

type ConditionsListProps = {
  conditions: FullLeadMedicalCondition[];
};
export const ConditionsList = ({ conditions }: ConditionsListProps) => {
  return (
    <>
      {conditions.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {conditions.map((condition) => (
            <ConditionCard key={condition.id} initCondition={condition} />
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
