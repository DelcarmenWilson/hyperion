import React from "react";
import { GoalIcon } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { AgentWorkInfoClient } from "./components/agent-work-info/client";
import { BluePrintYearlyClient } from "./components/yearly/client";
import { BluePrintWeeklyClient } from "./components/weekly/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BluePrintPage = () => {
  return (
    <PageLayout icon={GoalIcon} title="Blue Print">
      <Tabs defaultValue="agentWorkInfo">
        <TabsList>
          <TabsTrigger value="agentWorkInfo">Work Details</TabsTrigger>
          <TabsTrigger value="weeklyBluePrint">Weekly Blue Print</TabsTrigger>
          <TabsTrigger value="annualBluePrint">Annual Blue Print</TabsTrigger>
        </TabsList>
        <TabsContent value="agentWorkInfo">
          <AgentWorkInfoClient />
        </TabsContent>
        <TabsContent value="weeklyBluePrint">
          <BluePrintWeeklyClient />
        </TabsContent>
        <TabsContent value="annualBluePrint">
          <BluePrintYearlyClient />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default BluePrintPage;
