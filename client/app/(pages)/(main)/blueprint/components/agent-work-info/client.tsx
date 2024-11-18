"use client";
import React, { useEffect, useState } from "react";

import { useBluePrintData } from "@/hooks/use-blueprint";

import { AgentWorkInfoCard } from "./card";
import { BluePrintWeeklyCard } from "../weekly/card";
import { BluePrintYearlyCard } from "../yearly/card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyCard } from "@/components/reusable/empty-card";

import { OverviewChart, SriniChart } from "@/components/reports/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";

import { USDollar } from "@/formulas/numbers";
import { convertBluePrintMonthData } from "@/formulas/reports";
import { allMonths } from "@/constants/texts";
import { CreateAgentWorkInfoDialog } from "./form";

export const AgentWorkInfoClient = () => {
  const { onGetAgentWorkInfo, onGetBluePrintWeekReport } = useBluePrintData();

  const { agentWorkInfo, agentWorkInfoFetching } = onGetAgentWorkInfo();
  const { bluePrintWeekReport, bluePrintWeeksReportFetching } =
    onGetBluePrintWeekReport();

  const isEmpty = !agentWorkInfo && !agentWorkInfoFetching;

  const [isWeekly, setIsWeekly] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().getMonth().toString()
  );
  let premiumReport = convertBluePrintMonthData(
    bluePrintWeekReport!,
    isWeekly,
    currentMonth
  );
  const totalPremium = premiumReport.reduce((sum, week) => sum + week.total, 0);
  const maxPremium =
    Array.from(premiumReport).sort((a, b) => b.total - a.total)[0].total +
      1000 || 1000;

  useEffect(() => {
    premiumReport = convertBluePrintMonthData(
      bluePrintWeekReport!,
      isWeekly,
      currentMonth
    );
  }, [isWeekly]);
  return (
    <>
      <div>
        {agentWorkInfo && (
          <Card className="mb-2 border-0 shadow-none">
            <CardContent className="flex flex-col lg:flex-row justify-center items-start gap-2 !p-0">
              <div className="w-full lg:w-[30%] border p-3">
                <SkeletonWrapper isLoading={agentWorkInfoFetching}>
                  <BluePrintWeeklyCard />
                </SkeletonWrapper>
              </div>

              <div className="w-full lg:w-[30%] border p-3">
                <SkeletonWrapper isLoading={agentWorkInfoFetching}>
                  <BluePrintYearlyCard />
                </SkeletonWrapper>
              </div>

              <div className="flex-1 border p-3">
                <SkeletonWrapper isLoading={agentWorkInfoFetching}>
                  <AgentWorkInfoCard showButtons />
                </SkeletonWrapper>
              </div>
            </CardContent>
          </Card>
        )}

        {isEmpty && (
          <EmptyCard
            title="No details Found"
            subTitle={<CreateAgentWorkInfoDialog triggerText="Add Details" />}
          />
        )}

        <SkeletonWrapper isLoading={bluePrintWeeksReportFetching}>
          <div className="grid gap-2">
            <SriniChart
              data={premiumReport}
              title={`Premium - ${isWeekly ? "M" : "Y"}TD (${USDollar.format(
                totalPremium
              )})`}
              maxVal={maxPremium}
              menu={
                <div className="flex w-[400px] gap-2 items-center">
                  Month
                  <Switch checked={isWeekly} onCheckedChange={setIsWeekly} />
                  <Select
                    disabled={!isWeekly}
                    name="month"
                    defaultValue={currentMonth}
                    onValueChange={setCurrentMonth}
                  >
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMonths.map((month) => (
                        <SelectItem
                          key={month.abv}
                          value={month.value.toString()}
                        >
                          {month.abv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
            />
          </div>
        </SkeletonWrapper>
      </div>
    </>
  );
};
