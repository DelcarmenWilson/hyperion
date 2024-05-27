"use client";
import { useState, useEffect } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";

import { FullLeadMedicalCondition } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { columns } from "./columns";
import { cn } from "@/lib/utils";

type ConditionsClientProp = {
  leadId: string;
  initConditions: FullLeadMedicalCondition[];
  size?: string;
};

export const ConditionsClient = ({
  leadId,
  initConditions,
  size = "full",
}: ConditionsClientProp) => {
  const user = useCurrentUser();
  const [conditions, setConditions] =
    useState<FullLeadMedicalCondition[]>(initConditions);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");

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
    userEmitter.on("conditionInserted", (info) => onConditionInserted(info));
    userEmitter.on("conditionDeleted", (id) => onConditionDeleted(id));
    return () => {
      userEmitter.off("conditionInserted", (info) => onConditionInserted(info));
      userEmitter.off("conditionDeleted", (id) => onConditionDeleted(id));
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
          <div
            className={cn(
              "flex justify-between items-center p-1",
              size == "sm" && "flex-col text-center"
            )}
          >
            <h4 className="text-2xl font-semibold">Medical Conditions</h4>
            <ListGridTopMenu
              text="Add Condition"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
              size={size}
            />
          </div>
          <ConditionsList conditions={conditions} size={size} />
        </>
      )}
    </>
  );
};
