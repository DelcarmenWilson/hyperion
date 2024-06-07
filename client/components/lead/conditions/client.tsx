"use client";
import { useState, useEffect } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import { FullLeadMedicalCondition } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { columns } from "./columns";
import { leadConditionsGetAllById } from "@/actions/lead/condition";

type ConditionsClientProp = {
  leadId: string;
  size?: string;
};

export const ConditionsClient = ({
  leadId,
  size = "full",
}: ConditionsClientProp) => {
  const user = useCurrentUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");

  const conditionsQuery = useQuery<FullLeadMedicalCondition[]>({
    queryKey: ["leadConditions", `lead-${leadId}`],
    queryFn: () => leadConditionsGetAllById(leadId),
  });

  // const onConditionDeleted = (id: string) => {
  //   setConditions((conditions) => conditions.filter((e) => e.id !== id));
  // };
  // const onConditionInserted = (newCondition: FullLeadMedicalCondition) => {
  //   const existing = conditions.find((e) => e.id == newCondition.id);
  //   if (existing == undefined)
  //     setConditions((conditions) => [...conditions, newCondition]);
  // };

  // useEffect(() => {
  //   setConditions(initConditions);
  //   userEmitter.on("conditionInserted", (info) => onConditionInserted(info));
  //   userEmitter.on("conditionDeleted", (id) => onConditionDeleted(id));
  //   return () => {
  //     userEmitter.off("conditionInserted", (info) => onConditionInserted(info));
  //     userEmitter.off("conditionDeleted", (id) => onConditionDeleted(id));
  //   };
  // }, [initConditions]);

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
          data={conditionsQuery.data || []}
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
          <ConditionsList conditions={conditionsQuery.data || []} size={size} />
        </>
      )}
    </>
  );
};
