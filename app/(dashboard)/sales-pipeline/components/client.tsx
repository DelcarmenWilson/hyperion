"use client";
import { UserSquare } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box } from "./box";
import { FullLead } from "@/types";
import { PageLayout } from "@/components/custom/page-layout";

interface SaleClientProps {
  data: FullLead[];
}

export const SalesClient = ({ data }: SaleClientProps) => {
  return (
    <PageLayout
      title="Sales Pipeline"
      icon={UserSquare}
      topMenu={<div className="flex gap-2 mr-6">buttons</div>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Box title="New Lead Not called" leads={data} />
        <Box title="Week 1 Leads: No response" leads={data} />
        <Box title="Week 2 Leads: No response" leads={data} />
        <Box title="Week 3 Leads: No response" leads={data} />
        <Box title="Interested" leads={data} />
        <Box title="Non-Mobile# / Landline" leads={data} />
      </div>
    </PageLayout>
  );
};
