import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { HyperionLeadClient } from "./components/client";
import { hyperionLeadsGetAll } from "@/data/hyperion";

const HyperionLeadsPage = async () => {
  const leads = await hyperionLeadsGetAll();
  return (
    <PageLayoutAdmin
      title="Hyperion Leads"
      description="Manage all Hyperion Leads"
    >
      <HyperionLeadClient initLeads={leads} />
    </PageLayoutAdmin>
  );
};

export default HyperionLeadsPage;
