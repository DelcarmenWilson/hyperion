"use client";
import { Users } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadsData } from "./hooks/use-leads";

import { columns } from "./components/columns";
import { DataTable } from "@/components/tables/data-table";
import { PageLayout } from "@/components/custom/layout/page";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./components/top-menu";

const LeadsPage = () => {
  const { leads, isFetchingLeads } = useLeadsData();
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <PageLayout
      title="View Leads"
      icon={Users}
      topMenu={user.role != "ASSISTANT" && <TopMenu />}
    >
      <SkeletonWrapper isLoading={isFetchingLeads} fullHeight>
        <DataTable
          columns={columns}
          data={leads || []}
          striped
          hidden={{
            firstName: false,
          }}
          headers
          placeHolder="Search First | Last | Phone | Email"
          paginationType="advance"
          filterType="lead"
        />
      </SkeletonWrapper>
    </PageLayout>
  );
};

export default LeadsPage;
