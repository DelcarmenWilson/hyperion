import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { ScriptsClient } from "./components/client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type Props = {
  children: React.ReactNode;
};
const ScriptsLayoutPage = ({ children }: Props) => {
  return (
    <PageLayoutAdmin
      title={"Scripts"}
      description="Manage Scripts"
      scroll={false}
    >
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-scripts">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <ScriptsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} maxSize={80}>
          <div className="relative flex flex-1 h-full overflow-hidden">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageLayoutAdmin>
  );
};

export default ScriptsLayoutPage;
