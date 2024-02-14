"use client";
import { UserSquare } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box } from "./box";
import { FullLead } from "@/types";

interface SaleClientProps {
  data: FullLead[];
}

export const SalesClient = ({ data }: SaleClientProps) => {
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <UserSquare className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Sales Pipeline
          </CardTitle>
        </div>
        <div className="flex gap-2 mr-6">buttons</div>
      </div>

      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        <ScrollArea className="w-full flex-1 pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Box title="New Lead Not called" leads={data} />
            <Box title="Week 1 Leads: No response" leads={data} />
            <Box title="Week 2 Leads: No response" leads={data} />
            <Box title="Week 3 Leads: No response" leads={data} />
            <Box title="Interested" leads={data} />
            <Box title="Non-Mobile# / Landline" leads={data} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
