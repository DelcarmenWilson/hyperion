import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/tables/data-table";
import { PageUpdate } from "@prisma/client";
import React from "react";
import { columns } from "./columns";

const UpdateClient = ({ initUpdates }: { initUpdates: PageUpdate[] }) => {
  return (
    <>
      <Heading title="Page Updates" description="Manage all page updates" />
      <DataTable columns={columns} data={initUpdates} headers />
    </>
  );
};

export default UpdateClient;
