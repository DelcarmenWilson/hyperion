import { UserSquare } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { SalesClient } from "./components/client";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { leadsGetAllByAgentId } from "@/actions/lead";
import { pipelineGetAllByAgentId } from "@/actions/pipeline";
import { TopMenu } from "./components/top-menu";

const SalesPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const leads = await leadsGetAllByAgentId(user.id!);
  const pipelines = await pipelineGetAllByAgentId(user.id!);
  return (
    <PageLayout
      title="Sales Pipeline"
      icon={UserSquare}
      topMenu={<TopMenu pipelines={pipelines} />}
    >
      <SalesClient data={leads} pipelines={pipelines} />
    </PageLayout>
  );
};

export default SalesPage;
