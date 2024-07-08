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
  const topMenu = (
    <ListGridTopMenu
      text="Add Condition"
      setIsDrawerOpen={setIsDrawerOpen}
      isList={isList}
      setIsList={setIsList}
      size={size}
    />
  );

  const conditionsQuery = useQuery<FullLeadMedicalCondition[]>({
    queryKey: ["leadConditions", `lead-${leadId}`],
    queryFn: () => leadConditionsGetAllById(leadId),
  });

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
          topMenu={topMenu}
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
            {topMenu}
          </div>
          <ConditionsList conditions={conditionsQuery.data || []} size={size} />
        </>
      )}
    </>
  );
};
