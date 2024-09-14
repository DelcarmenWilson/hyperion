"use client";
import { useLeadsData } from "../hooks/use-leads";

import { columns } from "./columns";

import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const LeadsClient = () => {
  const { leads, isFetchingLeads } = useLeadsData();

  return (
    <SkeletonWrapper isLoading={isFetchingLeads} fullHeight>
      <DataTable
        columns={columns}
        data={leads || []}
        striped
        hidden={{
          firstName: false,
          lastName: false,
          cellPhone: false,
          email: false,
          status: false,
          vendor: false,
          state: false,
        }}
        headers
        placeHolder="Search First | Last | Phone | Email"
        paginationType="advance"
        filterType="lead"
      />
    </SkeletonWrapper>
  );
};
