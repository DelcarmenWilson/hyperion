"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { CallHistoryColumn, columns } from "./columns";
import { DashBoardTable } from "../dashboard-tables";

interface AgentSummaryBoxProps {
  data: CallHistoryColumn[];
}

export const CallHistory = ({ data }: AgentSummaryBoxProps) => {
  return (
    <Card className="relative  overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Call history
          </CardTitle>
        </div>
        <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
          add search and block list
          <p className="font-bold text-primary">1</p>
        </CardTitle>
      </div>

      <CardContent className="items-center space-y-0 pb-2">
        <DashBoardTable columns={columns} data={data} searchKey="fullName" />
      </CardContent>
    </Card>
  );
};
