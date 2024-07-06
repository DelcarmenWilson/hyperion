import { PageLayout } from "@/components/custom/layout/page-layout";
import React from "react";
import { TriggersClient } from "./components/client";
import { Workflow } from "lucide-react";

const WorkFlowsPage = () => {
  return (
    <PageLayout title="Triggers" icon={Workflow}>
      <TriggersClient />
    </PageLayout>
  );
};

export default WorkFlowsPage;
