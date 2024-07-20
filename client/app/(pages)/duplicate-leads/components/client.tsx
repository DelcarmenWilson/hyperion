"use client";
import { DataTable } from "@/components/tables/data-table";

import { LeadDuplicates } from "@prisma/client";
import { columns } from "./columns";

export const LeadClient = ({ leads }: { leads: LeadDuplicates[] }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={leads}
        striped
        hidden={{}}
        headers
        placeHolder="Search First | Last | Phone | Email"
        paginationType="advance"
        filterType="lead"
      />
    </>
  );
};
