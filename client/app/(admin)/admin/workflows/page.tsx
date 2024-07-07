import React from "react";
import { Workflow } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TriggersClient } from "./components/trigger/client";
import { ActionsClient } from "./components/action/client";

const WorkFlowsPage = () => {
  return (
    <PageLayout title="Workflow Settings" icon={Workflow}>
      <Tabs defaultValue="triggers" className="flex flex-col flex-1 h-full">
        <TabsList className="flex w-full h-auto">
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers">
          <TriggersClient />
        </TabsContent>
        <TabsContent value="actions">
          <ActionsClient />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default WorkFlowsPage;
