import { CardLayout } from "@/components/custom/layout/card";
import { ConversationsSidebar } from "./components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type Props = {
  children: React.ReactNode;
};
const ConversationsPageLayout = ({ children }: Props) => {
  return (
    <CardLayout>
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-lead">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <ConversationsSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="flex flex-1 h-full"
          defaultSize={80}
          maxSize={80}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default ConversationsPageLayout;
