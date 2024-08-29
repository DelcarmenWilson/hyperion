"use client";
import React from "react";
import Link from "next/link";
import { Campaign } from "@prisma/client";
import { formatDistance } from "date-fns";
import { formatDate } from "@/formulas/dates";

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  return (
    <Link
      href={`/admin/campaigns/${campaign.id}`}
      className="flex flex-col border rounded-xl overflow-ellipsis p-2 hover:bg-secondary cursor-pointer"
    >
      <p className="text-xs text-right">
        {formatDate(campaign.updatedAt)}
        {/* {formatDistance(campaign.updatedAt, new Date(), {
          addSuffix: true,
        })} */}
      </p>
      <p className=" text-muted-foreground text-sm truncate">{campaign.name}</p>
    </Link>
  );
};
