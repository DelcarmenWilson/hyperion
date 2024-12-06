import { UserSquare } from "lucide-react";

import { TopMenu } from "./components/top-menu";
import { SalesClient } from "./components/client";
import { getPipelines } from "@/actions/user/pipeline";
import { PageLayout } from "@/components/custom/layout/page";
import { getLeads } from "@/actions/lead/main/get-leads";

const SalesPage = async () => {
  const leads = await getLeads();
  const pipelines = await getPipelines();
  //TODO - need to add react query to this page
  return (
    <PageLayout
      title="Sales Pipeline"
      icon={UserSquare}
      topMenu={<TopMenu pipelines={pipelines} />}
    >
      <SalesClient leads={leads} pipelines={pipelines} />
    </PageLayout>
  );
};

export default SalesPage;
