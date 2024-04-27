"use client";
import { useState, useEffect } from "react";
import { emitter } from "@/lib/event-emmiter";

import { FullLeadMedicalCondition } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { columns } from "./columns";

type ConditionsClientProp = {
  leadId: string;
  initConditions: FullLeadMedicalCondition[];
};

export const ConditionsClient = ({
  leadId,
  initConditions,
}: ConditionsClientProp) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);
  const [conditions, setConditions] =
    useState<FullLeadMedicalCondition[]>(initConditions);

  const onConditionDeleted = (id: string) => {
    setConditions((conditions) => conditions.filter((e) => e.id !== id));
  };
  const onConditionInserted = (newCondition: FullLeadMedicalCondition) => {
    const existing = conditions.find((e) => e.id == newCondition.id);
    if (existing == undefined)
      setConditions((conditions) => [...conditions, newCondition]);
  };

  useEffect(() => {
    setConditions(initConditions);
    emitter.on("conditionInserted", (info) => onConditionInserted(info));
    emitter.on("conditionDeleted", (id) => onConditionDeleted(id));
    return () => {
      emitter.off("conditionInserted", (info) => onConditionInserted(info));
      emitter.off("conditionDeleted", (id) => onConditionDeleted(id));
    };
  }, [initConditions]);

  return (
    <>
      <DrawerRight
        title="New Condition"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <ConditionForm leadId={leadId} onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <DataTable
          columns={columns}
          data={conditions}
          headers
          topMenu={
            <ListGridTopMenu
              text="Add Condition"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Medical Conditions</h4>
            <ListGridTopMenu
              text="Add Condition"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
            />
          </div>
          <ConditionsList conditions={conditions} />
        </>
      )}
      {/* <div>
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
              <ConditionCard key={condition.id} initCondition={condition} />
            ))}
          </div>
        ) : (
          <div>
            <p className="font-semibold text-center">No Conditions Found</p>
          </div>
        )}
      </div> */}
    </>
  );
};
