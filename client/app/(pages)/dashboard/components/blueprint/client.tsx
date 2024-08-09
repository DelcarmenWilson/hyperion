"use client";
import React from "react";
import { GoalIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { BluePrint, BluePrintWeek, FullTimeInfo } from "@prisma/client";

import { CardLayout } from "@/components/custom/card/layout";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BluePrintCard } from "./card";
import { DetailsCard } from "@/app/(pages)/blueprint/components/full-time-info/details-card";
import { TargetCard } from "@/app/(pages)/blueprint/components/full-time-info/target-card";

import { bluePrintActive} from "@/actions/blueprint/blueprint";
import {  fullTimeInfoGetByUserId } from "@/actions/blueprint/full-time-info";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { bluePrintWeekGetActive } from "@/actions/blueprint/blueprint-week";

export const BluePrintClient = () => {
  const { data: blueprint, isFetching } = useQuery<BluePrint | null>({
    queryFn: () => bluePrintActive(),
    queryKey: ["agentBluePrintActive"],
  });
  const { data: bluePrintWeek, isFetching:isFetchingBluePrintWeek } = useQuery<BluePrintWeek | null>({
    queryFn: () => bluePrintWeekGetActive(),
    queryKey: ["agentBluePrintWeekActive"],
  });
  const { data: fullTimeInfoData, isFetching: isFetchingFullTimeInfo } =
    useQuery<FullTimeInfo | null>({
      queryFn: () => fullTimeInfoGetByUserId(),
      queryKey: ["agentFullTimeInfo"],
    });
  const targets = calculateWeeklyBluePrint(fullTimeInfoData?.annualTarget || 0);
  return (
    <CardLayout icon={GoalIcon} title="Blue Print">
      <Tabs defaultValue="blueprint">
        <TabsList>
          <TabsTrigger value="blueprint">Blue Print</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        <SkeletonWrapper isLoading={isFetching}>
          <TabsContent value="blueprint">
            {blueprint ? (
              <BluePrintCard blueprint={bluePrintWeek} />
            ) : (
              <EmptyCard title={"No Blueprint"} />
            )}
          </TabsContent>
          <TabsContent value="details">
            {fullTimeInfoData ? (
              <DetailsCard info={fullTimeInfoData} size="sm" />
            ) : (
              <EmptyCard title={"No Details"} />
            )}
          </TabsContent>
          <TabsContent className="h-full" value="plan">
            {fullTimeInfoData ? (
              <div className="w-full h-full bg-muted p-2">
                <TargetCard
                  target={
                    targets.find((e) => e.type == fullTimeInfoData.targetType)!
                  }
                  size="sm"
                />
              </div>
            ) : (
              <EmptyCard title={"No Details"} />
            )}
          </TabsContent>
        </SkeletonWrapper>
      </Tabs>
    </CardLayout>
  );
};
