import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { HyperionLeadClient } from "./components/client";

const HyperionLeadsPage = () => {
  return (
    <PageLayoutAdmin
      title="Hyperion Leads"
      description="Manage all Hyperion Leads"
    >
      <HyperionLeadClient />
    </PageLayoutAdmin>
  );
};

export default HyperionLeadsPage;
