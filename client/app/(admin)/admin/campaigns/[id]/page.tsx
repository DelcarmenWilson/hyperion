import { CampaignClient } from "./components/client";
import { CampaignsClient } from "../components/client";
import { Card, CardContent } from "@/components/ui/card";

import { gptConversationGetById } from "@/actions/test";

const CampaingPage = async ({ params }: { params: { id: string } }) => {
  const conversation = await gptConversationGetById(params.id);

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <CampaignsClient />
        <CampaignClient campaingId={params.id} />
      </CardContent>
    </Card>
  );
};

export default CampaingPage;
