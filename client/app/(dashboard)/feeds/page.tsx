import React from "react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { MessageSquarePlus } from "lucide-react";
import { FeedsClient } from "./components/client";

const FeedsPage = async () => {
  return (
    <PageLayout icon={MessageSquarePlus} title="Feeds">
      <FeedsClient />
    </PageLayout>
  );
};

export default FeedsPage;
