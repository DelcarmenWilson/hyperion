"use client";
import React, { useState } from "react";
import { CampaignCreative } from "@prisma/client";
import { CreativeCard } from "./card";

type Props = {
  initCreatives: CampaignCreative[];
};
export const CreativeList = ({ initCreatives }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [creatives, setCreatives] = useState<CampaignCreative[]>(initCreatives);

  const onCreativeInserted = (e: CampaignCreative) => {
    setCreatives((creatives) => [...creatives, e]);
    setIsOpen(false);
  };

  const onCreativeDeleted = (id: string) => {
    setCreatives((creatives) => creatives.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {creatives.map((creative) => (
        <CreativeCard
          key={creative.id}
          initCreative={creative}
          onCreativeDeleted={onCreativeDeleted}
        />
      ))}
    </div>
  );
};
