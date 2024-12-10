"use client";
import { useState } from "react";
import { useCampaignStore } from "@/stores/campaign-store";
import { useCampaignData } from "@/hooks/use-campaigns";

import { Button } from "@/components/ui/button";
import { CampaignCard } from "./card";
import { CampaignForm } from "./form";
import { CampaignSection } from "./section";
import { EmptyCard } from "@/components/reusable/empty-card";
import { useFacebookData } from "@/app/(pages)/(main)/settings/(routes)/config/hooks/use-config";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const CampaignsClient = () => {
  const [campaingnOpen, setCampaingnOpen] = useState(false);
  const { adAccount } = useFacebookData();

  const {
    isFormViewOpen,
    setFormViewOpen,
    isAudienceViewOpen,
    setAudienceViewOpen,
    isCreativeViewOpen,
    setCreativeViewOpen,
  } = useCampaignStore();
  const {
    campaignId,
    adsetId,
    adId,
    campaigns,
    isFetchingCampaigns,
    onImportCampaings,
  } = useCampaignData(adAccount as string);

  return (
    <>
      <CampaignForm
        isOpen={campaingnOpen}
        onClose={() => setCampaingnOpen(false)}
      />
      <div className="flex flex-col h-full w-full gap-1 p-1">
        <SkeletonWrapper fullHeight isLoading={isFetchingCampaigns}>
          <div className="flex-1 space-y-2 overflow-y-auto h-full">
            {campaigns && campaigns.length > 0 ? (
              <CampaignSection
                label="Campaigns"
                hint="new campaign"
                onNew={() => setCampaingnOpen(true)}
              >
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    name={campaign.name}
                    updated_at={campaign.updated_at}
                    link={`/admin/campaigns/${campaign.id}`}
                    active={campaignId == campaign.id}
                  >
                    <CampaignSection
                      label="Adsets"
                      hint="new adset"
                      header={false}
                    >
                      {campaign.adsets?.map((adset) => (
                        <CampaignCard
                          key={adset.id}
                          name={adset.name}
                          updated_at={adset.updated_at}
                          link={`/admin/campaigns/${campaign.id}/${adset.id}`}
                          active={adsetId == adset.id}
                        >
                          <CampaignSection
                            label="Ads"
                            hint="new ad"
                            header={false}
                          >
                            {adset.ads?.map((ad) => (
                              <CampaignCard
                                key={ad.id}
                                name={ad.name}
                                updated_at={ad.updated_at}
                                link={`/admin/campaigns/${campaign.id}/${adset.id}/${ad.id}`}
                                active={adId == ad.id}
                                arrow={false}
                              />
                            ))}
                          </CampaignSection>
                        </CampaignCard>
                      ))}
                    </CampaignSection>
                  </CampaignCard>
                ))}
              </CampaignSection>
            ) : (
              <EmptyCard
                title="No Campaigns"
                subTitle={
                  <div className="flex flex-col gap-2 justify-center items-center">
                    {adAccount && (
                      <>
                        <Button onClick={() => setCampaingnOpen(true)}>
                          New Campaign
                        </Button>

                        <span>OR</span>
                        <Button onClick={onImportCampaings}>
                          Import Existing Campaigns
                        </Button>
                      </>
                    )}
                  </div>
                }
              />
            )}
          </div>
          {campaignId && (
            <div className="flex justify-between p-2 gap-2">
              <Button
                className="gap-2"
                size="sm"
                variant={isFormViewOpen ? "default" : "outline"}
                onClick={setFormViewOpen}
              >
                Forms
              </Button>
              <Button
                size="sm"
                variant={isAudienceViewOpen ? "default" : "outline"}
                onClick={setAudienceViewOpen}
              >
                Audiences
              </Button>
              <Button
                className="gap-2"
                size="sm"
                variant={isCreativeViewOpen ? "default" : "outline"}
                onClick={setCreativeViewOpen}
              >
                Creatives
              </Button>
            </div>
          )}
        </SkeletonWrapper>
      </div>
    </>
  );
};
