import { CardLayout } from "@/components/custom/layout/card";
import ChatsSidebar from "./components/chats/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type Props = {
  children: React.ReactNode;
};
const ChatsLayout = ({ children }: Props) => {
  return (
    <CardLayout>
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-chats">
        <ResizablePanel defaultSize={25} minSize={25} maxSize={30}>
          <ChatsSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="relative flex flex-1 h-full overflow-hidden"
          defaultSize={70}
          maxSize={70}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default ChatsLayout;
