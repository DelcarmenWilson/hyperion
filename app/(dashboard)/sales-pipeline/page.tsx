import { currentUser } from "@/lib/auth";
import { SalesClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/data/lead";
import { FullLead } from "@/types";

const SalesPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);
  const formattedLeads: FullLead[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    autoChat: lead.conversations[0]?.autoChat,
    notes: lead.notes as string,
    createdAt: lead.createdAt,
  }));
  return (
    <>
      <SalesClient data={formattedLeads} />
    </>
  );
};

export default SalesPage;
