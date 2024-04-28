"use client";
import { useEffect, useState } from "react";
import { emitter } from "@/lib/event-emmiter";

import { useGlobalContext } from "@/providers/global";

import { LeadStatus } from "@prisma/client";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { DrawerRight } from "@/components/custom/drawer-right";
import { columns } from "./columns";
import { LeadStatusForm } from "./form";
import { LeadStatusList } from "./list";

export const LeadStatusClient = () => {
  const { leadStatus, setLeadStatus } = useGlobalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    const onUserLeadStatusDeleted = (id: string) => {
      setLeadStatus((leadStatus) => {
        if (!leadStatus) return leadStatus;
        return leadStatus.filter((e) => e.id !== id);
      });
    };
    const onUserLeadStatusInserted = (newLeadStatus: LeadStatus) => {
      const existing = leadStatus?.find((e) => e.id == newLeadStatus.id);
      if (existing == undefined)
        setLeadStatus((leadStatus) => [...leadStatus!, newLeadStatus]);
    };

    const onUserLeadStatusUpdated = (updatedLeadStatus: LeadStatus) => {
      setLeadStatus((leadStatus) => {
        if (!leadStatus) return leadStatus;
        return leadStatus
          .filter((e) => e.id != updatedLeadStatus.id)
          .concat(updatedLeadStatus);
      });
    };
    emitter.on("userLeadStatusDeleted", (id) => onUserLeadStatusDeleted(id));
    emitter.on("userLeadStatusInserted", (info) =>
      onUserLeadStatusInserted(info)
    );
    emitter.on("userLeadStatusUpdated", (info) =>
      onUserLeadStatusUpdated(info)
    );
    return () => {
      emitter.on("userLeadStatusDeleted", (id) => onUserLeadStatusDeleted(id));
      emitter.on("userLeadStatusInserted", (info) =>
        onUserLeadStatusInserted(info)
      );
      emitter.on("userLeadStatusUpdated", (info) =>
        onUserLeadStatusUpdated(info)
      );
    };
  }, []);
  return (
    <>
      <DrawerRight
        title={"New Lead Status"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <LeadStatusForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>

      {isList ? (
        <DataTable
          columns={columns}
          data={leadStatus?.filter((e) => e.type != "default")!}
          headers
          title="Lead Status"
          topMenu={
            <ListGridTopMenu
              text="Add Status"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Lead Status</h4>
            <ListGridTopMenu
              text="Add Status"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
            />
          </div>
          <LeadStatusList
            leadStatus={leadStatus?.filter((e) => e.type != "default")!}
          />
        </>
      )}
    </>
  );
};
