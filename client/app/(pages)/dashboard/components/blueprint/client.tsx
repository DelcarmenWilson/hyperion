"use client";
import React from "react";
import { GoalIcon } from "lucide-react";

import { CardLayout } from "@/components/custom/card/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AgentWorkInfoCard } from "@/app/(pages)/blueprint/components/agent-work-info/card";

import { BluePrintYearlyCard } from "@/app/(pages)/blueprint/components/yearly/card";
import { BluePrintWeeklyCard } from "@/app/(pages)/blueprint/components/weekly/card";

export const BluePrintClient = () => {
  return (
    <CardLayout icon={GoalIcon} title="Blue Print">
      <Tabs defaultValue="blueprint">
        <TabsList>
          <TabsTrigger value="blueprint">Blue Print</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="blueprint">
          <BluePrintWeeklyCard />
        </TabsContent>
        <TabsContent value="details">
          <AgentWorkInfoCard size="sm" />
        </TabsContent>
        <TabsContent className="h-full" value="plan">
          <BluePrintYearlyCard />
        </TabsContent>
      </Tabs>
    </CardLayout>
  );
};
