"use client";
import { Users } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useLeadsData } from "./hooks/use-leads";

import { columns } from "./components/columns";
import { DataTable } from "@/components/tables/data-table";
import { PageLayout } from "@/components/custom/layout/page";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./components/top-menu";
import { allAgents } from "@/constants/page-routes";

const LeadsPage = () => {
  const { leads, isFetchingLeads } = useLeadsData();
  const role = useCurrentRole();
  return (
    <PageLayout
      title="View Leads"
      icon={Users}
      topMenu={allAgents.includes(role!) && <TopMenu />}
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
