import { LeadSidebar } from "./components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type Props = {
  children: React.ReactNode;
};

const LeadLayoutPage = ({ children }: Props) => {
  return (
    <div className="flex gap-2 absolute top-12 left-0 bg-secondary w-full h-[calc(100%-3rem)] px-2 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-lead">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <LeadSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="flex-1 h-full" defaultSize={80} maxSize={80}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default LeadLayoutPage;
