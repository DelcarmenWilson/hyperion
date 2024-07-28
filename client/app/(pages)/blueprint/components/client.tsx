"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import BluePrintForm from "./form";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { BluePrint } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { bluePrintsGetAllByUserId } from "@/actions/blueprint";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const BluePrintClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isFetching } = useQuery<BluePrint[]>({
    queryFn: () => bluePrintsGetAllByUserId(),
    queryKey: ["agentBluePrints"],
  });
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          {/* <b><h3> Input Details</h3></b> */}
          <h3 className="text-2xl font-semibold py-2">Input Details</h3>
          <BluePrintForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
      <SkeletonWrapper isLoading={isFetching}>
        <DataTable
          columns={columns}
          data={data || []}
          striped
          headers
          placeHolder="Search"
          paginationType="simple"
          topMenu={<Button onClick={() => setIsOpen(true)}>Open Form</Button>}
        />
      </SkeletonWrapper>
    </>
  );
};

export default BluePrintClient;
