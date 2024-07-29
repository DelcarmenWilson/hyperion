import { PageLayout } from "@/components/custom/layout/page-layout";
import { GoalIcon, MessageSquarePlus } from "lucide-react";
import React from "react";
import BluePrintClient from "./components/client";
import { FullTimeInfoClient } from "./components/full-time-info/client";

const BluePrintPage = () => {
  return (

    <div>
      <PageLayout icon={GoalIcon} title="Blue Print">
        <FullTimeInfoClient/>
        <BluePrintClient />
      </PageLayout>
    </div>
  );
};

export default BluePrintPage;
