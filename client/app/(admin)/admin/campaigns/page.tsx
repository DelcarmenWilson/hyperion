import { redirect } from "next/navigation";
import { EmptyCard } from "@/components/reusable/empty-card";
import { campaignGetLast } from "@/actions/facebook/campaign";

const CampaignsPage = async () => {
  const campaign = await campaignGetLast();
  if (campaign) {
    redirect(`/admin/campaigns/${campaign.id}`);
  }
  return <EmptyCard title={"Create a Campaign"} />;
};

export default CampaignsPage;
