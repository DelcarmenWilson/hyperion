"use client";
import React from "react";
import { useBluePrintData } from "@/hooks/use-blueprint";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";

export const BluePrintYearlyClient = () => {
  const { onBluePrintsGet } = useBluePrintData();
  const { bluePrints, bluePrintsIsFetching } = onBluePrintsGet();
  return (
    <SkeletonWrapper isLoading={bluePrintsIsFetching}>
      <DataTable
        columns={columns}
        data={bluePrints || []}
        striped
        headers
        placeHolder="Search"
        paginationType="simple"
      />
    </SkeletonWrapper>
  );
};
