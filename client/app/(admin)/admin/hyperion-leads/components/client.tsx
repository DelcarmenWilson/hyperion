"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";

import { HyperionLead } from "@prisma/client";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { HyperionLeadList } from "./list";

type HyperionLeadClientProps = {
  initLeads: HyperionLead[];
};
export const HyperionLeadClient = ({ initLeads }: HyperionLeadClientProps) => {
  const user = useCurrentUser();
  const [leads, setLeads] = useState(initLeads);
  const [isList, setIsList] = useState(user?.dataStyle == "list");

  useEffect(() => {
    const onHyperionLeadDeleted = (id: string) => {
      setLeads((leads) => {
        if (!leads) return leads;
        return leads.filter((e) => e.id !== id);
      });
    };
    const onHyperionLeadInserted = (newHyperionLead: HyperionLead) => {
      const existing = leads?.find((e) => e.id == newHyperionLead.id);
      if (existing == undefined)
        setLeads((leads) => [...leads!, newHyperionLead]);
    };

    const onHyperionLeadUpdated = (updatedHyperionLead: HyperionLead) => {
      setLeads((hyperionleads) => {
        if (!hyperionleads) return hyperionleads;
        return hyperionleads
          .filter((e) => e.id != updatedHyperionLead.id)
          .concat(updatedHyperionLead);
      });
    };
    adminEmitter.on("hyperionLeadDeleted", (id) => onHyperionLeadDeleted(id));
    adminEmitter.on("hyperionLeadInserted", (info) =>
      onHyperionLeadInserted(info)
    );
    adminEmitter.on("hyperionLeadUpdated", (info) =>
      onHyperionLeadUpdated(info)
    );
    return () => {
      adminEmitter.on("hyperionLeadDeleted", (id) => onHyperionLeadDeleted(id));
      adminEmitter.on("hyperionLeadInserted", (info) =>
        onHyperionLeadInserted(info)
      );
      adminEmitter.on("hyperionLeadUpdated", (info) =>
        onHyperionLeadUpdated(info)
      );
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isList ? (
        <DataTable
          columns={columns}
          data={leads!}
          headers
          title="Hyperion Lead"
          topMenu={
            <ListGridTopMenu
              text="Add Lead"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={() => {}}
              showButton={false}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">HyperionLeads</h4>
            <ListGridTopMenu
              text="Add Lead"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={() => {}}
              showButton={false}
            />
          </div>
          <HyperionLeadList leads={leads!} />
        </>
      )}
    </>
  );
};
