"use client";
import { useState } from "react";

import { UserTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { UserTemplateForm } from "./form";
import { useGlobalContext } from "@/providers/global";

export const UserTemplateClient = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { templates, setTemplates } = useGlobalContext();

  const onTemplateCreated = (newTp?: UserTemplate) => {
    if (newTp) setTemplates((tp) => [...tp!, newTp]);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <DrawerRight
        title={"New Template"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <UserTemplateForm onClose={onTemplateCreated} />
      </DrawerRight>

      <Heading title={"Templates"} description="Manage all your templates" />

      <DataTable
        columns={columns}
        data={templates!}
        headers
        topMenu={
          <div className="col-span-3 text-end">
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> New Template
            </Button>
          </div>
        }
      />
    </>
  );
};
