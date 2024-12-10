"use client";
import { Folder } from "lucide-react";
import { useCampaignData } from "../../../../../hooks/use-campaigns";

import { PageMiniLayout } from "@/components/custom/layout/page-mini";

import { CardData } from "@/components/reusable/card-data";
import { DataContainer } from "@/components/reusable/data-container";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
import { StatusSelect } from "../components/status-select";

import { formatHyperionDate } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const CampaingPage = () => {
  const { campaign, isFetchingCampaign } = useCampaignData();

  if (!campaign) return null;
  const {
    name,
    bid_strategy,
    buying_type,
    daily_budget,
    objective,
    smart_promotion_type,
    source_campaign_id,
    start_time,
    status,
    created_at,
    updated_at,
  } = campaign;
  return (
    <PageMiniLayout
      title="Campaign"
      name={name}
      icon={Folder}
      status={<StatusSelect status={status} setStatus={() => {}} />}
    >
      <SkeletonWrapper isLoading={isFetchingCampaign}>
        <DataContainer>
          <Heading title="Campaign Name" size="text-sm" />
          <Input value={name} type="text" />
        </DataContainer>

        <DataContainer>
          <Heading
            title="Advantage campaign budget"
            description="Advantage campaign budget will distribute your budget across currently delivering ad sets to get more results depending on your performance goal choices and bid strategy. You can control spending on each ad set."
            size="text-xl"
          />
          <Heading title="Campaign budget" size="text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <Input value="Daily Buget" disabled />
            <Input value={daily_budget as string} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Heading title="Bid Strategy" size="text-sm" />

              <Input value={bid_strategy as string} />
            </div>

            <div>
              <Heading title="Buying Type" size="text-sm" />
              <Input value={buying_type as string} />
            </div>

            <div>
              <Heading title="Objective" size="text-sm" />
              <Input value={objective as string} />
            </div>
          </div>
        </DataContainer>

        <DataContainer>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Heading title="Start Time" size="text-sm" />

              <Input
                value={start_time ? formatHyperionDate(start_time) : "Not Set"}
              />
            </div>

            <div>
              <Heading title="Created Date " size="text-sm" />
              <Input value={formatHyperionDate(created_at)} />
            </div>
            <div>
              <Heading title="Updated Date" size="text-sm" />
              <Input value={formatHyperionDate(updated_at)} />
            </div>
          </div>
        </DataContainer>
        <DataContainer>
          <CardData label="smart_promotion_type" value={smart_promotion_type} />
          <CardData label="source_campaign_id" value={source_campaign_id} />
        </DataContainer>
      </SkeletonWrapper>
    </PageMiniLayout>
  );
};

export default CampaingPage;
