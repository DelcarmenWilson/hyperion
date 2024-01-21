import { currentUser } from "@/lib/auth";
import { chatSettingsGetById } from "@/data/chat-settings";

import { ChatClient } from "./components/client";

const ChatPage = async () => {
  const user = await currentUser();

  const chatSettings = await chatSettingsGetById(user?.id as string);
  if (!chatSettings) return null;
  return <ChatClient data={chatSettings} />;
};

export default ChatPage;
