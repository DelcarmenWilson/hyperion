import { conversationGetById } from "@/data/conversation";
import ConversationClient from "./components/client";

const ConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const conversation = await conversationGetById(params.conversationId);
  return <ConversationClient conversation={conversation!} />;
};

export default ConversationPage;
