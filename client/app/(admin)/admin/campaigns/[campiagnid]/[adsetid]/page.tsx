"use client";
import { LayoutGrid } from "lucide-react";

import { useCampaignData } from "../../hooks/use-campaigns";

import { PageMiniLayout } from "@/components/custom/layout/page-mini";

import { DataContainer } from "@/components/reusable/data-container";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { StatusSelect } from "../../components/status-select";

import { formatHyperionDate } from "@/formulas/dates";

const AdsetPage = () => {
  const { adset, isFetchingAdset } = useCampaignData();

  if (!adset) return null;
  const {
    name,
    billing_event,
    optimization_goal,
    optimization_sub_event,
    start_time,
    status,
    created_at,
    updated_at,
  } = adset;
  return (
    <PageMiniLayout
      title="Adset"
      name={name}
      icon={LayoutGrid}
      status={<StatusSelect status={status} setStatus={() => {}} />}
    >
      <SkeletonWrapper isLoading={isFetchingAdset}>
        <DataContainer>
          <Heading title="Adset Name" size="text-sm" />
          <Input value={name} type="text" />
        </DataContainer>

        <DataContainer>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Heading title="Billing Event" size="text-sm" />
              <Input value={billing_event as string} />
            </div>

            <div>
              <Heading title="Optimization Goal" size="text-sm" />
              <Input value={optimization_goal as string} />
            </div>
            <div>
              <Heading title="Optimization Sub Event" size="text-sm" />
              <Input value={optimization_sub_event as string} />
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
      </SkeletonWrapper>
    </PageMiniLayout>
  );
};

export default AdsetPage;
