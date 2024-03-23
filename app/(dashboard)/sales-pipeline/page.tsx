import { currentUser } from "@/lib/auth";
import { SalesClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/data/lead";
import { pipelineGetAllByAgentId } from "@/actions/pipeline";

const SalesPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const leads = await leadsGetAllByAgentId(user.id!);
  const pipelines = await pipelineGetAllByAgentId(user.id!);
  return <SalesClient data={leads} pipelines={pipelines} />;
};

export default SalesPage;
