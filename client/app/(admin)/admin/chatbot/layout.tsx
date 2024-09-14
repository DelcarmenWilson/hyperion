import { CardLayout } from "@/components/custom/layout/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GptConversationsClient } from "./components/client";

type Props = {
  children: React.ReactNode;
};
const ChatbotLayout = async ({ children }: Props) => {
  return (
    <CardLayout>
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-chatbot">
        <ResizablePanel defaultSize={25} maxSize={30} minSize={20}>
          <GptConversationsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={80}
          maxSize={80}
          className="relative flex flex-1 h-full overflow-hidden"
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default ChatbotLayout;
