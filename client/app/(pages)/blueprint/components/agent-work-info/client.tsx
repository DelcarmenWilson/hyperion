"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useBluePrint, useBluePrintActions } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { AgentWorkInfo, BluePrint, BluePrintWeek } from "@prisma/client";

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
import { OverviewChart } from "@/components/reports/chart";
import { BluePrintWeekForm } from "../weekly/form";

import { convertBluePringWeekData } from "@/formulas/reports";
import { USDollar } from "@/formulas/numbers";

export const AgentWorkInfoClient = () => {
  const { onWorkInfoFormOpen } = useBluePrint();
  const {
    agentWorkInfo,
    isFetchingAgentWorkInfo,
    bluePrintWeekReport,
    isFetchingBluePrintWeeksReport,
  } = useBluePrintActions();

  const premiumReport = convertBluePringWeekData(bluePrintWeekReport!);
  const totalPremium = premiumReport.reduce((sum, week) => sum + week.total, 0);

  return (
    <>
      <AgentWorkInfoForm />
      <BluePrintWeekForm />
      <div>
        <SkeletonWrapper isLoading={isFetchingAgentWorkInfo}>
          {agentWorkInfo ? (
            <Card className="mb-2 border-0">
              <CardDescription>
                <CardTitle></CardTitle>
              </CardDescription>
              <CardContent className="flex flex-col lg:flex-row justify-center items-start gap-2">
                <div className="w-full lg:w-[30%] border p-3">
                  <BluePrintWeeklyCard />
                </div>

                <div className="w-full lg:w-[30%] border p-3">
                  <BluePrintYearlyCard />
                </div>
                <div className="flex-1 border p-3">
                  <AgentWorkInfoCard />
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyCard
              title="No details Found"
              subTitle={
                <Button onClick={() => onWorkInfoFormOpen()}>
                  Add Details
                </Button>
              }
            />
          )}
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={isFetchingBluePrintWeeksReport}>
          <div className="grid grid-cols-2 gap-2">
            {/* {JSON.stringify(bluePrintWeekReport)} */}
            <OverviewChart
              data={premiumReport}
              title={`Premium - YTD (${USDollar.format(totalPremium)})`}
              legend={false}
            />
          </div>
        </SkeletonWrapper>
      </div>
    </>
  );
};
