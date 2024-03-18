"use client";
import { useState } from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LeadMedicalCondition } from "@prisma/client";
import { ConditionForm } from "./form";
import { ConditionCard } from "./card";
import { Button } from "@/components/ui/button";

type ConditionsClientProp = {
  leadId: string;
  initConditions: LeadMedicalCondition[];
};

export const ConditionsClient = ({
  leadId,
  initConditions,
}: ConditionsClientProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conditions, setConditions] =
    useState<LeadMedicalCondition[]>(initConditions);

  const onConditionInserted = (e: LeadMedicalCondition) => {
    setConditions((conditions) => [...conditions, e]);
    setIsOpen(false);
  };

  const onConditionDeleted = (id: string) => {
    setConditions((conditions) => conditions.filter((e) => e.id !== id));
  };

  return (
    <>
      <DrawerRight
        title="New Condition"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ConditionForm
          leadId={leadId}
          onClose={() => setIsOpen(false)}
          onConditionChange={onConditionInserted}
        />
      </DrawerRight>
      <div>
        <div className="flex justify-between items-center border-b p-2 mb-2">
          <p className=" text-2xl font-semibold">Medical Conditions</p>
          <Button onClick={() => setIsOpen(true)}>Add Condition</Button>
        </div>
        {conditions.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {conditions.map((condition) => (
              <ConditionCard
                key={condition.id}
                initCondition={condition}
                onConditionDeleted={onConditionDeleted}
              />
            ))}
          </div>
        ) : (
          <div>
            <p className="font-semibold text-center">No Conditions Found</p>
          </div>
        )}
      </div>
    </>
  );
};
