import React from "react";
import { GoalIcon } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { FullTimeInfoClient } from "./components/full-time-info/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BluePrintClient from "./components/client";
import { WeeklyBluePrintClient } from "./components/weekly/client";

const BluePrintPage = () => {
  return (
    <div>
      <PageLayout icon={GoalIcon} title="Blue Print">
      <Tabs defaultValue="weeklyBluePrint">
        <TabsList>
          <TabsTrigger value="weeklyBluePrint">Weekly Blue Print</TabsTrigger>
          <TabsTrigger value="annualBluePrint">Annual Blue Print</TabsTrigger>
          <TabsTrigger value="fullTimeDetails">Full Time Details</TabsTrigger>
        </TabsList>
        
          <TabsContent value="weeklyBluePrint">
          <WeeklyBluePrintClient/>
          </TabsContent>
          <TabsContent value="annualBluePrint">
          <BluePrintClient />
          </TabsContent>
          <TabsContent value="fullTimeDetails">
          <FullTimeInfoClient />
          </TabsContent>
          
          
      
      </Tabs>
        
      </PageLayout>
    </div>
  );
};

export default BluePrintPage;
