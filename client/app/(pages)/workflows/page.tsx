import { PageLayout } from "@/components/custom/layout/page-layout";
import { Workflow } from "lucide-react";
import React from "react";
import { WorkFlowClient } from "./components/client";

const WorkFlowsPage = async () => {
  return (
    <PageLayout title="Work Flows" icon={Workflow}>
      <WorkFlowClient />
    </PageLayout>
  );
};

export default WorkFlowsPage;
