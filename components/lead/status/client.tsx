"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { LeadStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/tables/data-table";
import { DrawerRight } from "@/components/custom/drawer-right";
import { columns } from "./columns";

import { useGlobalContext } from "@/providers/global";
import { LeadStatusForm } from "./form";

type LeadStatusClientProps = {
  leadStatus: LeadStatus[];
};
export const LeadStatusClient = ({ leadStatus }: LeadStatusClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setLeadStatus } = useGlobalContext();

  const onStatusCreated = (e?: LeadStatus) => {
    if (e) {
      setLeadStatus((status) => {
        return [...status!, e];
      });
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <DrawerRight
        title={"New Lead Status"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <LeadStatusForm onClose={onStatusCreated} />
      </DrawerRight>
      <Heading title={`Lead Status`} description="Manage lead status" />
      <DataTable
        columns={columns}
        data={leadStatus}
        topMenu={
          <div className="col-span-3 text-end">
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> New Status
            </Button>
          </div>
        }
      />
    </>
  );
};
