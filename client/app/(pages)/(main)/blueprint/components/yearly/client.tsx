"use client";
import React from "react";
import { useBluePrintData } from "@/hooks/use-blueprint";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";

export const BluePrintYearlyClient = () => {
  const { onGetBluePrints } = useBluePrintData();
  const { bluePrints, bluePrintsFetching } = onGetBluePrints();
  return (
    <SkeletonWrapper isLoading={bluePrintsFetching}>
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
