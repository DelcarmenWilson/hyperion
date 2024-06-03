"use client";
import { cn } from "@/lib/utils";
import { CarrierConditionCard } from "./card";
import { FullCarrierCondition } from "@/types";

type CarrierConditionListsProps = {
  carrierConditions: FullCarrierCondition[];
  size?: string;
};
export const CarrierConditionsList = ({
  carrierConditions: carrierCondition,
  size = "full",
}: CarrierConditionListsProps) => {
  return (
    <>
      {carrierCondition.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {carrierCondition.map((carriercondition) => (
            <CarrierConditionCard
              key={carriercondition.conditionId}
              initCarrierCondition={carriercondition}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No CarrierCondition Found</p>
        </div>
      )}
    </>
  );
};
