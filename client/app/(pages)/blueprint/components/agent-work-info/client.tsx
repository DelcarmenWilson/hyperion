"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBluePrint } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { AgentWorkInfo, BluePrint, BluePrintWeek } from "@prisma/client";
import { agentWorkInfoGetByUserId } from "@/actions/blueprint/agent-work-info";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { EmptyCard } from "@/components/reusable/empty-card";

import { AgentWorkInfoCard } from "./card";
import { AgentWorkInfoForm } from "./form";
import { BluePrintWeeklyCard } from "../weekly/card";
import { BluePrintYearlyCard } from "../yearly/card";

import { bluePrintGetActive } from "@/actions/blueprint/blueprint";
import { bluePrintWeekGetActive } from "@/actions/blueprint/blueprint-week";

export const AgentWorkInfoClient = () => {
  const { onWorkInfoFormOpen } = useBluePrint();
  const { data: agentWorkInfo, isFetching: isFetchingAgentWorkinfo } =
    useQuery<AgentWorkInfo | null>({
      queryFn: () => agentWorkInfoGetByUserId(),
      queryKey: ["agentWorkInfo"],
    });
  const { data: weekData, isFetching: isFetchingWeekData } =
    useQuery<BluePrintWeek | null>({
      queryFn: () => bluePrintWeekGetActive(),
      queryKey: ["agentBluePrintWeekActive"],
    });
  const { data: yearData, isFetching: isFetchingYearData } =
    useQuery<BluePrint | null>({
      queryFn: () => bluePrintGetActive(),
      queryKey: ["agentBluePrintActive"],
    });

  return (
    <>
      <AgentWorkInfoForm />
      <SkeletonWrapper isLoading={isFetchingAgentWorkinfo}>
        {agentWorkInfo ? (
          <Card className="mb-2 border-0">
            <CardDescription>
              <CardTitle></CardTitle>
            </CardDescription>
            <CardContent className="flex flex-col lg:flex-row justify-center items-start gap-2">
              <div className="w-full lg:w-[30%] border p-3">
                <BluePrintWeeklyCard info={weekData} />
              </div>

              <div className="w-full lg:w-[30%] border p-3">
                <BluePrintYearlyCard info={yearData} />
              </div>
              <div className="flex-1 border p-3">
                <AgentWorkInfoCard info={agentWorkInfo} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyCard
            title="No details Found"
            subTitle={
              <Button onClick={() => onWorkInfoFormOpen()}>Add Details</Button>
            }
          />
        )}
      </SkeletonWrapper>
    </>
  );
};
