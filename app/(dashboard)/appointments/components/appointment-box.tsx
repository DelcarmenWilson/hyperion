"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { AppointmentColumn, columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { PageLayoutScroll } from "@/components/custom/page-layout-scroll";

interface AppointmentBoxProps {
  data: AppointmentColumn[];
}

export const AppointmentBox = ({ data }: AppointmentBoxProps) => {
  return (
    <PageLayoutScroll title="Appointments" icon={Calendar}>
      <DashBoardTable columns={columns} data={data} searchKey="fullName" />
    </PageLayoutScroll>
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
