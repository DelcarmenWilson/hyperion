import React from "react";
import { GoalIcon } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { FullTimeInfoClient } from "./components/full-time-info/client";

const BluePrintPage = () => {
  return (
    <div>
      <PageLayout icon={GoalIcon} title="Blue Print">
        <FullTimeInfoClient />
      </PageLayout>
    </div>
  );
};

export default BluePrintPage;
