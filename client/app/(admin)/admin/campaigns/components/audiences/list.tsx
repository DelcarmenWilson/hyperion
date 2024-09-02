"use client";
import React, { useState } from "react";
import { CampaignAudience } from "@prisma/client";
import { AudienceCard } from "./card";

type Props = {
  initAudiences: CampaignAudience[];
};
export const AudienceList = ({ initAudiences }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [audiences, setAudiences] = useState<CampaignAudience[]>(initAudiences);

  const onAudienceInserted = (e: CampaignAudience) => {
    setAudiences((audiences) => [...audiences, e]);
    setIsOpen(false);
  };

  const onAudienceDeleted = (id: string) => {
    setAudiences((audiences) => audiences.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {audiences.map((audience) => (
        <AudienceCard
          key={audience.id}
          initAudience={audience}
          onAudienceDeleted={onAudienceDeleted}
        />
      ))}
    </div>
  );
};
