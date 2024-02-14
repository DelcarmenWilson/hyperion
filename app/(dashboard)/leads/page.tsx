import { currentUser } from "@/lib/auth";

import { LeadClient } from "./components/client";

import { leadsGetAllByAgentId } from "@/data/lead";
import { FullLead } from "@/types";

const LeadsPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);

  const formattedLeads: FullLead[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email!,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    autoChat: lead.conversation?.autoChat || false,
    notes: lead.notes as string,
    calls: lead.calls,
    lastCall: lead.calls[lead.calls.length - 1],
    appointments: lead.appointments,
    appointment: lead.appointments[0],
    vendor: lead.vendor,
    type: lead.type,
    status: lead.status,
    quote: lead.quote!,
    saleAmount: lead.saleAmount!,
    commision: lead.commision!,
    costOfLead: lead.costOfLead!,
    createdAt: lead.createdAt,
  }));

  return (
    <>
      <LeadClient leads={formattedLeads} />
    </>
  );
};

export default LeadsPage;
