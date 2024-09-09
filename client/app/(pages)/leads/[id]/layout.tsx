import { LeadSidebar } from "./components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { LeadHeader } from "@/components/lead/header";
import { AssistantForm } from "@/components/lead/forms/assistant-form";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";
import { PolicyInfoForm } from "@/components/lead/forms/policy-info-form";
import { ShareForm } from "@/components/lead/forms/share-form";
import { TransferForm } from "@/components/lead/forms/transfer-form";
import { MainInfoForm } from "@/components/lead/forms/main-info-form";
import { GeneralInfoForm } from "@/components/lead/forms/general-info-form";

type Props = {
  children: React.ReactNode;
};

const LeadLayoutPage = ({ children }: Props) => {
  return (
    <div className="flex gap-2 absolute top-14 left-0 bg-secondary w-full h-[calc(100%-3.5rem)] p-2 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-lead">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <LeadSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} maxSize={80}>
          <div className="flex-1 h-full">{children}</div>
          <MainInfoForm />
          <GeneralInfoForm />

          <PolicyInfoForm />
          <ShareForm />
          <TransferForm />
          <IntakeForm />
          <AssistantForm />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default LeadLayoutPage;
