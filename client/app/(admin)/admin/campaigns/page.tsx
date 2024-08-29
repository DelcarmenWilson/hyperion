import { Card, CardContent } from "@/components/ui/card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { CampaignsClient } from "./components/client";

const CampaignsPage = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <CampaignsClient />
        <EmptyCard
          title={"It's good to see you!! Speak your mind and Get Answers"}
        />
      </CardContent>
    </Card>
  );
};

export default CampaignsPage;
