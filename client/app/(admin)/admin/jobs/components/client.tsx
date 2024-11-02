"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useJobData } from "../hooks/use-job";

import { DataTable } from "@/components/tables/data-table";
import { JobFormDrawer } from "./form";
import { columns } from "./columns";
import { JobList } from "./list";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useJobStore } from "../hooks/use-store";

export const JobClient = () => {
  const user = useCurrentUser();
  const { onJobFormOpen } = useJobStore();
  const { jobs, isFetchingJobs } = useJobData();
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
            <JobList jobs={jobs || []} />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
