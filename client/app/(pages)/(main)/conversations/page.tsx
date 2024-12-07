import { redirect } from "next/navigation";
import { EmptyCard } from "@/components/reusable/empty-card";
import { getLastConversation } from "@/actions/lead/conversation";

const ConversationsPage = async () => {
  const conversation = await getLastConversation();

  if (conversation) {
    redirect(`/conversations/${conversation.id}`);
  }
  return <EmptyCard title="Start a new Conversation" />;
};

export default ConversationsPage;
