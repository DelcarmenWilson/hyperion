"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";

import { FullLeadMedicalCondition } from "@/types";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { ConditionForm } from "./form";

import { deleteLeadCondition } from "@/actions/lead/condition";
import { formatDate } from "@/formulas/dates";
import { useLeadConditionActions } from "@/hooks/lead/use-condition";

export const ConditionCard = ({
  condition,
}: {
  condition: FullLeadMedicalCondition;
}) => {
  const {
    alertOpen,
    setAlertOpen,
    onConditionFormOpen,
    onConditionDelete,
    isPendingConditionDelete,
  } = useLeadConditionActions();

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onConditionDelete(condition.id)}
        loading={isPendingConditionDelete}
        height="auto"
      />
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
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={() => onConditionFormOpen(condition.id)}>
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};
