"use client";
import React from "react";
import { useBluePrintActions } from "@/hooks/use-blueprint";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";

export const BluePrintYearlyClient = () => {
  const { bluePrints, isFetchingBluePrints } = useBluePrintActions();
  return (
    <SkeletonWrapper isLoading={isFetchingBluePrints}>
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