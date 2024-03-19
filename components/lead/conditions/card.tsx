"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ConditionForm } from "./form";

import { leadConditionDeleteById } from "@/actions/lead";
import { toast } from "sonner";

import { AlertModal } from "@/components/modals/alert";
import { Edit, Trash } from "lucide-react";
import { FullLeadMedicalCondition } from "@/types";
import { format } from "date-fns";

type ConditionCardProps = {
  initCondition: FullLeadMedicalCondition;
  onConditionDeleted: (e: string) => void;
};
export const ConditionCard = ({
  initCondition,
  onConditionDeleted,
}: ConditionCardProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [condition, setCondition] = useState(initCondition);

  const onConditionUpdated = (e: FullLeadMedicalCondition) => {
    setCondition(e);
  };

  const onDeleteCondition = () => {
    leadConditionDeleteById(condition.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        onConditionDeleted(condition.id);
        toast.success(data.success);
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteCondition}
        loading={loading}
      />
      <DrawerRight
        title="Edit Beneficiary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ConditionForm
          condition={condition}
          onClose={() => setIsOpen(false)}
          onConditionChange={onConditionUpdated}
        />
      </DrawerRight>
      <div className="grid grid-cols-4 mb-1 items-center gap-2">
        <span>{condition.condition.name}</span>
        <span>{format(condition.diagnosed, "MM-dd-yy")}</span>
        <span>{condition.medications}</span>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
          <Button size="icon" onClick={() => setIsOpen(true)}>
            <Edit size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};
