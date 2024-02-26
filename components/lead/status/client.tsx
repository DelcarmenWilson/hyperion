"use client";
import { useState } from "react";

import { LeadStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./columns";

import { useGlobalContext } from "@/providers/global-provider";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LeadStatusForm } from "./form";
import { Plus } from "lucide-react";

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
      <div className="flex justify-between items-end">
        <Heading title={`Lead Status`} description="Manage lead status" />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Status
        </Button>
      </div>

      <DataTable columns={columns} data={leadStatus} searchKey="status" />
    </>
  );
};
