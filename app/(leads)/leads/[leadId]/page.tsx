import { db } from "@/lib/db";
import { LeadGetById } from "@/data/lead";
import { LeadClient } from "./components/lead-client";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await LeadGetById(params.leadId);

  const conversation = await db.conversation.findFirst({
    where: { leadId: params.leadId },
    include: { lead: true, user: true },
  });

  const messages = await db.message.findMany({
    where: { conversationId: conversation?.id, NOT: { role: "system" } },
  });

  return (
    <div className="py-4">
      <LeadClient
        lead={lead}
        initialMessages={messages}
        userName={conversation?.user?.name as string}
        leadName={conversation?.lead?.lastName as string}
      />
    </div>
  );
};

export default LeadsPage;
