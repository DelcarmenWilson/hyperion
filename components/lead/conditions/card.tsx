"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { FullLeadMedicalCondition } from "@/types";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { ConditionForm } from "./form";

import { leadConditionDeleteById } from "@/actions/lead";

type ConditionCardProps = {
  initCondition: FullLeadMedicalCondition;
};
export const ConditionCard = ({ initCondition }: ConditionCardProps) => {
  const [condition, setCondition] = useState(initCondition);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteCondition = () => {
    setLoading(true);
    leadConditionDeleteById(condition.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        userEmitter.emit("conditionDeleted", condition.id);
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };
  useEffect(() => {
    setCondition(initCondition);
    const onConditionUpdated = (e: FullLeadMedicalCondition) => {
      if (e.id == condition.id) setCondition(e);
    };
    userEmitter.on("conditionUpdated", (info) => onConditionUpdated(info));
  }, [initCondition]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteCondition}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Beneficiary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ConditionForm condition={condition} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {condition.condition.name}
        </h3>

        <CardData
          title="Date Diagnosed"
          value={format(condition.diagnosed, "MM-dd-yy")}
        />
        <CardData title="Medications" value={condition.medications} />

        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
