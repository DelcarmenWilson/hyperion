import { currentUser } from "@/lib/auth";
import { Users } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page-layout";
import { DataTable } from "@/components/tables/data-table";

import { columns } from "./components/columns";
import { TopMenu } from "./components/top-menu";

import { leadsGetAllByAgentId } from "@/actions/lead";
const LeadsPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const leads = await leadsGetAllByAgentId(user.id);

  return (
    <PageLayout title="View Leads" icon={Users} topMenu={<TopMenu />}>
      <DataTable
        columns={columns}
        data={leads}
        hidden={{
          firstName: false,
          lastName: false,
          cellPhone: false,
          email: false,
          status: false,
          vendor: false,
          state: false,
        }}
        placeHolder="Search First | Last | Phone | Email"
        paginationType="advance"
        filterType="lead"
      />
    </PageLayout>
  );
};

export default LeadsPage;
