import { CardLayout } from "@/components/custom/layout/card";
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
      <CampaignsClient />
      <div className="relative flex flex-1 h-full overflow-hidden">
        {children}

        <CreativeClient />
        <AudienceClient />
        <FormClient />
      </div>
    </CardLayout>
  );
};

export default CampaignLayout;
