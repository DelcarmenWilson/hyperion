import { currentUser } from "@/lib/auth";
import { LeadClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/data/lead";

const LeadsPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);

  return <LeadClient leads={leads} />;
};

export default LeadsPage;
