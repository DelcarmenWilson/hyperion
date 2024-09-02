"use client";
import React from "react";

import { CampaignAudience } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/reusable/loader";
import { useQuery } from "@tanstack/react-query";
import { campaignAudiencesGetAll } from "@/actions/facebook/audience";

type Props = {
  value: string | undefined;
  onChange: (e: string) => void;
};

export const TargetSelect = ({ value, onChange }: Props) => {
  const { data: targets, isFetching: isTargetsFetching } = useQuery<
    CampaignAudience[]
  >({
    queryKey: ["selectAudience"],
    queryFn: () => campaignAudiencesGetAll(),
  });

  return (
    <>
      {isTargetsFetching ? (
        <Loader text="Loading Users..." />
      ) : (
        <Select
          name="ddlAudience"
          disabled={isTargetsFetching}
          onValueChange={onChange}
          defaultValue={value}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Target Audience" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {targets?.map((target) => (
              <SelectItem key={target.id} value={target.id}>
                {target.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
