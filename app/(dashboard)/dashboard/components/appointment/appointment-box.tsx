"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { AppointmentColumn, columns } from "./columns";
import { DashBoardTable } from "../dashboard-table";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentBoxProps {
  data: AppointmentColumn[];
}

export const AppointmentBox = ({ data }: AppointmentBoxProps) => {
  return (
    <Card className="relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Appointments
          </CardTitle>
        </div>
      </div>
      <CardContent className="items-center space-y-0 pb-2">
        <DashBoardTable columns={columns} data={data} searchKey="fullName" />
      </CardContent>
    </Card>
  );
};

export const AppointmentBoxSkeleton = () => {
  return (
    <Card className="relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-[50px] aspect-square rounded-br-lg" />
          <CardTitle>
            <Skeleton className="w-[100px] h-5" />
          </CardTitle>
        </div>
      </div>
      <CardContent className="items-center space-y-0 pb-2">
        {/* <DashBoardTable columns={columns} data={data} searchKey="fullName" /> */}
      </CardContent>
    </Card>
  );
};
