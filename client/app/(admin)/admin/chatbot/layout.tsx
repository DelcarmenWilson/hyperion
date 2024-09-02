import { CardLayout } from "@/components/custom/layout/card";
import { GptConversationsClient } from "./components/client";

type Props = {
  children: React.ReactNode;
};
const ChatbotLayout = async ({ children }: Props) => {
  return (
    <CardLayout>
      <GptConversationsClient />
      {children}
    </CardLayout>
  );
};

export default ChatbotLayout;
