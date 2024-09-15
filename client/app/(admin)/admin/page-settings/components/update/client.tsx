"use client";
import React, { useState } from "react";
import { useAdminData } from "@/hooks/admin/use-admin";
import { Plus } from "lucide-react";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { UpdateForm } from "./form";

import SkeletonWrapper from "@/components/skeleton-wrapper";

const UpdateClient = () => {
  const { pageUpdates, isPageUpdatesFetching } = useAdminData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <DrawerRight
        title={"New Update"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <UpdateForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>

      <Heading title="Page Updates" description="Manage all page updates" />
      <SkeletonWrapper isLoading={isPageUpdatesFetching}>
        <DataTable
          columns={columns}
          data={pageUpdates || []}
          headers
          topMenu={
            <div className="flex col-span-3 gap-2 justify-end">
              <Button onClick={() => setIsDrawerOpen(true)}>
                <Plus size={16} className="mr-2" /> Add Update
              </Button>
            </div>
          }
        />
      </SkeletonWrapper>
    </>
  );
};

export default UpdateClient;
