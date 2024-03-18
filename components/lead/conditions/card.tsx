"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LeadMedicalCondition } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ConditionForm } from "./form";

import { leadBeneficiaryDeleteById } from "@/actions/lead";
import { toast } from "sonner";

import { AlertModal } from "@/components/modals/alert-modal";
import { Edit, Trash } from "lucide-react";

type ConditionCardProps = {
  initCondition: LeadMedicalCondition;
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

  const onConditionUpdated = (e: LeadMedicalCondition) => {
    setCondition(e);
  };

  const onDeleteCondition = () => {
    leadBeneficiaryDeleteById(condition.id).then((data) => {
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
        <span>{condition.conditionId}</span>
        <span>{condition.diagnosed}</span>
        <span>{condition.medications}</span>

        <div className="flex gap-2 justify-end">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setAlertOpen(false)}
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
