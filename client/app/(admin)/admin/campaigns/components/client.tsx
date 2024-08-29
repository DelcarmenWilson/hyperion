"use client";
import { useState } from "react";
import { Notebook, Plus, Settings } from "lucide-react";
import { useCampaignData } from "@/hooks/use-campaigns";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import { CampaignCard } from "./card";
import { CampaignForm } from "./form";
import { FormForm } from "./form-form";
import { AudienceForm } from "./audience-form";

export const CampaignsClient = () => {
  const [campaingnOpen, setCampaingnOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const { campaigns } = useCampaignData();

  return (
    <>
      <CampaignForm
        isOpen={campaingnOpen}
        onClose={() => setCampaingnOpen(false)}
      />
      <FormForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
      <AudienceForm
        isOpen={audienceOpen}
        onClose={() => setAudienceOpen(false)}
      />

      <div className="flex flex-col h-full w-[250px] gap-1 p-1">
        <div className="flex justify-between items-center">
          <h4 className="text-lg text-muted-foreground font-semibold">
            Campaigns
          </h4>

          <Button size={"icon"} onClick={() => setCampaingnOpen(true)}>
            <Plus size={16} />
          </Button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto h-full">
          {campaigns && campaigns.length > 0 ? (
            <>
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </>
          ) : (
            <EmptyCard
              title="No Campaigns"
              subTitle={
                <Button onClick={() => setCampaingnOpen(true)}>
                  New Campaign
                </Button>
              }
            />
          )}
        </div>
        <div className="flex justify-between border-t pt-2 gap-2">
          <Button
            className="gap-2"
            size="sm"
            variant="outline"
            onClick={() => setFormOpen(true)}
          >
            <Plus size={16} /> Form
          </Button>
          <Button
            className="gap-2"
            size="sm"
            variant="outline"
            onClick={() => setAudienceOpen(true)}
          >
            <Plus size={16} /> Audience
          </Button>
        </div>
      </div>
    </>
  );
};
