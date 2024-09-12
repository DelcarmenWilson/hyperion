import { UserSquare } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";
import { TopMenu } from "./components/top-menu";
import { SalesClient } from "./components/client";

import { leadsGetAll } from "@/actions/lead";
import { pipelineGetAllByAgentId } from "@/actions/pipeline";

const SalesPage = async () => {
  const leads = await leadsGetAll();
  const pipelines = await pipelineGetAllByAgentId();
  //TODO - need to add react query to this page
  return (
    <PageLayout
      contentClass="!p-2"
      title="Sales Pipeline"
      icon={UserSquare}
      topMenu={<TopMenu pipelines={pipelines} />}
      scroll={false}
    >
      <SalesClient leads={leads} pipelines={pipelines} />
    </PageLayout>
  );
};

export default SalesPage;
