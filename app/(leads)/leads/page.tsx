import { leadsGetAll } from "@/data/lead";
import { LeadColumn, columns } from "./components/columns";
import { LeadClient } from "./components/client";
const LeadsPage = async () => {
  const leads = await leadsGetAll();

  const formattedLeads: LeadColumn[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    cellPhone: lead.cellPhone,
    conversationId: lead.conversation?.id as string,
  }));

  return <LeadClient data={formattedLeads} />;
};

export default LeadsPage;
