import { CardLayout } from "@/components/custom/layout/card";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CampaignsClient } from "./components/client";
import { CreativeClient } from "./components/creatives/client";
import { AudienceClient } from "./components/audiences/client";
import { FormClient } from "./components/forms/client";

type Props = {
  children: React.ReactNode;
};
const CampaignLayout = ({ children }: Props) => {
  return (
    <CardLayout>
      <ResizablePanelGroup direction="horizontal" autoSaveId="rpg-campaigns">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <CampaignsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="relative flex flex-1 h-full overflow-hidden"
          defaultSize={80}
          maxSize={80}
        >
          {children}
          <CreativeClient />
          <AudienceClient />
          <FormClient />
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default CampaignLayout;
