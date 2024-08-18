"use client";
import React, { useEffect, useState } from "react";

import { useBluePrint, useBluePrintActions } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";

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
import { OverviewChart, SriniChart } from "@/components/reports/chart";
import { BluePrintWeekForm } from "../weekly/form";

import { convertBluePrintMonthData } from "@/formulas/reports";
import { USDollar } from "@/formulas/numbers";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allMonths } from "@/constants/texts";

export const AgentWorkInfoClient = () => {
  const { onWorkInfoFormOpen } = useBluePrint();
  const {
    agentWorkInfo,
    isFetchingAgentWorkInfo,
    bluePrintWeekReport,
    isFetchingBluePrintWeeksReport,
  } = useBluePrintActions();

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
