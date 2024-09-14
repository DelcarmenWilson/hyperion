import { CardLayout } from "@/components/custom/layout/card";
import { ChatsClient } from "./components/chats/client";
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
        <ResizablePanel defaultSize={20} minSize={20} maxSize={25}>
          <ChatsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="relative flex flex-1 h-full overflow-hidden"
          defaultSize={80}
          maxSize={80}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default ChatsLayout;
