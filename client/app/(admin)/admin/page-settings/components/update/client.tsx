"use client";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/tables/data-table";
import { PageUpdate } from "@prisma/client";
import React, { useState } from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { UpdateForm } from "./form";

const UpdateClient = ({ initUpdates }: { initUpdates: PageUpdate[] }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <DrawerRight
        title={"New Update"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <UpdateForm onClose={() => {}} />
      </DrawerRight>

      <Heading title="Page Updates" description="Manage all page updates" />
      <DataTable
        columns={columns}
        data={initUpdates}
        headers
        topMenu={
          <div className="flex col-span-3 gap-2 justify-end">
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> Add Update
            </Button>
          </div>
        }
      />
    </>
  );
};

export default UpdateClient;
