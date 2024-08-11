"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { BluePrint } from "@prisma/client";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";
import { bluePrintsGetAllByUserId } from "@/actions/blueprint/blueprint";

export const BluePrintYearlyClient = () => {
  const { data, isFetching } = useQuery<BluePrint[]>({
    queryFn: () => bluePrintsGetAllByUserId(),
    queryKey: ["agentBluePrints"],
  });
  return (
    <SkeletonWrapper isLoading={isFetching}>
      <DataTable
        columns={columns}
        data={data || []}
        striped
        headers
        placeHolder="Search"
        paginationType="simple"
      />
    </SkeletonWrapper>
  );
};
