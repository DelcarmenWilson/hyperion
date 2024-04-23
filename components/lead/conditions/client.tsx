"use client";
import { useState, useEffect } from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { Button } from "@/components/ui/button";

import { ConditionForm } from "./form";
import { ConditionCard } from "./card";
import { FullLeadMedicalCondition } from "@/types";

type ConditionsClientProp = {
  leadId: string;
  initConditions: FullLeadMedicalCondition[];
};

export const ConditionsClient = ({
  leadId,
  initConditions,
}: ConditionsClientProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conditions, setConditions] =
    useState<FullLeadMedicalCondition[]>(initConditions);

  const onConditionInserted = (e: FullLeadMedicalCondition) => {
    setConditions((conditions) => [...conditions, e]);
    setIsOpen(false);
  };

  const onConditionDeleted = (id: string) => {
    setConditions((conditions) => conditions.filter((e) => e.id !== id));
  };

  useEffect(() => {
    setConditions(initConditions);
  }, [initConditions]);

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
        <div className="flex flex-col lg:flex-row justify-between items-center border-b p-2 mb-2">
          <p className=" text-2xl font-semibold">Medical Conditions</p>
          <Button onClick={() => setIsOpen(true)}>Add Condition</Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 mb-1 items-center gap-2">
          <span>Condition</span>
          <span>Date diagnosed</span>
          <span>Medications</span>
          <span>Actions</span>
        </div>
        {conditions.length ? (
          <div>
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
