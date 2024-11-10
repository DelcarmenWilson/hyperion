import { ChatClient } from "./components/client";
import { chatSettingsGet } from "@/actions/settings/chat";

const ChatPage = async () => {
  const chatSettings = await chatSettingsGet();
  if (!chatSettings) return null;
  return <ChatClient chatSettings={chatSettings} />;
};

export default ChatPage;
