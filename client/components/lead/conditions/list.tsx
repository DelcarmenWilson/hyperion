"use client";
import { cn } from "@/lib/utils";

import {
  useLeadConditionActions,
  useLeadConditionStore,
} from "@/hooks/lead/use-condition";

import { FullLeadMedicalCondition } from "@/types";

import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";

import { ConditionForm } from "./form";

import { formatDate } from "@/formulas/dates";
import DeleteDialog from "@/components/custom/delete-dialog";

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

const ConditionCard = ({
  condition,
}: {
  condition: FullLeadMedicalCondition;
}) => {
  const { onConditionFormOpen } = useLeadConditionStore();
  const { onDeleteCondition, conditionDeleting } = useLeadConditionActions();

  return (
    <>
      <ConditionForm />
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {condition.condition.name}
        </h3>

        <CardData
          label="Date Diagnosed"
          value={formatDate(condition.diagnosed)}
        />
        <CardData label="Medications" value={condition.medications} />

        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <DeleteDialog
            title="condition"
            cfText="delete"
            onConfirm={() => onDeleteCondition(condition.id)}
            loading={conditionDeleting}
          />

          <Button onClick={() => onConditionFormOpen(condition.id)}>
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};
