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
        <ResizablePanel className=" min-w-[250px] max-w-[350px]">
          <CampaignsClient />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="relative flex flex-1 h-full overflow-hidden">
            {children}

            <CreativeClient />
            <AudienceClient />
            <FormClient />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardLayout>
  );
};

export default CampaignLayout;
