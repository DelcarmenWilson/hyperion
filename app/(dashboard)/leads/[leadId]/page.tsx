import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
import { FullLead } from "@/types";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);

  const formattedLead: FullLead = {
    id: lead?.id!,
    firstName: lead?.firstName!,
    lastName: lead?.lastName!,
    email: lead?.email!,
    cellPhone: lead?.cellPhone!,
    address: lead?.address!,
    city: lead?.city!,
    state: lead?.state!,
    zipCode: lead?.zipCode!,
    defaultNumber: lead?.defaultNumber!,
    autoChat: lead?.conversation?.autoChat!,
    notes: lead?.notes as string,
    calls: lead?.calls!,
    lastCall: lead?.calls[lead?.calls.length - 1],
    appointments: lead?.appointments!,
    lastApp: lead?.appointments[0],
    vendor: lead?.vendor!,
    type: lead?.type!,
    status: lead?.status!,
    quote: lead?.quote!,
    saleAmount: lead?.saleAmount!,
    commision: lead?.commision!,
    costOfLead: lead?.costOfLead!,
    createdAt: lead?.createdAt!,
  };

  return <LeadClient lead={formattedLead!} nextPrev={prevNext} />;
};

export default LeadsPage;
