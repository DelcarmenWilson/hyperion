"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useJobData, useJobStore } from "../hooks/use-jobs";

import { DataTable } from "@/components/tables/data-table";
import { JobFormDrawer } from "./form";
import { columns } from "./columns";
import { JobList } from "./list";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const JobClient = () => {
  const user = useCurrentUser();
  const { jobs, isFetchingJobs } = useJobData();
  const { onJobFormOpen } = useJobStore();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingJobs}>
      <ListGridTopMenu
        text="New Job"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={onJobFormOpen}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <JobFormDrawer />
      {isList ? (
        <SkeletonWrapper isLoading={isFetchingJobs}>
          <DataTable
            columns={columns}
            data={jobs || []}
            headers
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="p-2">{topMenu}</div>
          <SkeletonWrapper isLoading={isFetchingJobs}>
            <JobList initJobs={jobs || []} />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
