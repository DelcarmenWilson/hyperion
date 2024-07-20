import { Users } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page-layout";

import { LeadClient } from "./components/client";
import { leadDuplicatesGetAllByUserId } from "@/actions/lead/duplicate";
const DuplicateLeadsPage = async () => {
  const leads = await leadDuplicatesGetAllByUserId();
  return (
    <PageLayout title="View Duplicate Leads" icon={Users}>
      <LeadClient leads={leads} />
    </PageLayout>
  );
};

export default DuplicateLeadsPage;
