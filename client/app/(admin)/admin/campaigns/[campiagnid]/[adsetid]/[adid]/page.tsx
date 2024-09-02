"use client";

import { AppWindow } from "lucide-react";
import Image from "next/image";
import { useCampaignData } from "../../../hooks/use-campaigns";

import { PageMiniLayout } from "@/components/custom/layout/page-mini";

import { CardData } from "@/components/reusable/card-data";
import { DataContainer } from "@/components/reusable/data-container";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
import { StatusSelect } from "../../../components/status-select";
import { Textarea } from "@/components/ui/textarea";
import { formatHyperionDate } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const AdPage = () => {
  const { ad, isFetchingAd } = useCampaignData();

  if (!ad) return null;
  const {
    name,
    bid_type,
    demolink_hash,
    preview_shareable_link,
    creative,
    status,
    created_at,
    updated_at,
  } = ad;
  return (
    <PageMiniLayout
      title="Ad"
      name={name}
      icon={AppWindow}
      status={<StatusSelect status={status} setStatus={() => {}} />}
    >
      <SkeletonWrapper isLoading={isFetchingAd}>
        <DataContainer>
          <Heading title="Ad Name" size="text-sm" />
          <Input value={name} type="text" />
        </DataContainer>

        <DataContainer>
          <CardData label="Bid Type" value={bid_type} />
          <CardData label="Demolink Hash" value={demolink_hash} />
          <CardData
            label="Preview Shareable Link"
            value={preview_shareable_link}
          />
        </DataContainer>

        <DataContainer>
          <div className="grid grid-cols-3 gap-2">
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

        {creative && (
          <DataContainer>
            <div className="flex items-center justify-between">
              <Heading title="Ad Creative" size="text-xl" />

              <div className="m-w-[250px]">
                <StatusSelect status={creative.status} setStatus={() => {}} />
              </div>
            </div>

            <Heading title="Name" size="text-sm" />
            <Input value={creative.name} type="text" />
            {creative.image_url && (
              <Image
                height={250}
                width={250}
                src={creative.image_url}
                alt={name}
              />
            )}

            <Heading title="Title" size="text-sm" />
            <Input value={creative.title as string} type="text" />

            <Heading title="Body" size="text-sm" />
            <Textarea value={creative.body as string} rows={5} />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Heading title="Call To Action Type  " size="text-sm" />
                <Input value={creative.call_to_action_type as string} />
              </div>
              <div>
                <Heading title="Object Type" size="text-sm" />
                <Input value={creative.object_type} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Heading title="Created Date " size="text-sm" />
                <Input value={formatHyperionDate(creative.created_at)} />
              </div>
              <div>
                <Heading title="Updated Date" size="text-sm" />
                <Input value={formatHyperionDate(creative.updated_at)} />
              </div>
            </div>
          </DataContainer>
        )}
      </SkeletonWrapper>
    </PageMiniLayout>
  );
};

export default AdPage;
