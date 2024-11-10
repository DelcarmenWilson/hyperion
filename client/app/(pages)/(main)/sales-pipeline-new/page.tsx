import { UserSquare } from "lucide-react";

import { TopMenu } from "./components/top-menu";
import { SalesClient } from "./components/client";
import { leadsGetAll } from "@/actions/lead";
import { pipelineGetAll } from "@/actions/user/pipeline";
import { PageLayout } from "@/components/custom/layout/page";

const SalesPage = async () => {
  const leads = await leadsGetAll();
  const pipelines = await pipelineGetAll();
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
