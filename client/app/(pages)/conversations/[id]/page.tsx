import ConversationClient from "./components/client";
import { ConversationLeadInfo } from "./components/lead-info";

const ConversationPage = async () => {
  return (
    <>
      <ConversationClient />
      <ConversationLeadInfo size="sm" />
    </>
  );
};

export default ConversationPage;
