import { UserSquare } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { PageLayout } from "@/components/custom/layout/page-layout";
import { TopMenu } from "./components/top-menu";
import { SalesClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/actions/lead";
import { pipelineGetAllByAgentId } from "@/actions/pipeline";

const SalesPage = async () => {
  const user = await currentUser();

  if (!user) return null;
  const leads = await leadsGetAllByAgentId(user.id!);
  const pipelines = await pipelineGetAllByAgentId();
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
