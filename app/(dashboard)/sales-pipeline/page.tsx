import { currentUser } from "@/lib/auth";
import { SalesClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/data/lead";
import { LeadColumn } from "../leads/components/columns";

const SalesPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);
  const formattedLeads: LeadColumn[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    autoChat: lead.autoChat,
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
