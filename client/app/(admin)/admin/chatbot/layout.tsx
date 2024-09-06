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
        <ResizablePanel className=" min-w-[250px] max-w-[350px]">
          <GptConversationsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="relative flex flex-1 h-full overflow-hidden">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {children}
    </CardLayout>
  );
};

export default ChatbotLayout;
