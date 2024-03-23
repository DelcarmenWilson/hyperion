"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/custom/page-layout";
import { FullAppointment } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { DatesFilter } from "@/components/reusable/dates-filter";

type AppointmentClientProps = {
  data: FullAppointment[];
};

export const AppointmentClient = ({ data }: AppointmentClientProps) => {
  return (
    <PageLayout title="Appointments" icon={Calendar}>
      <DataTable
        columns={columns}
        data={data}
        headers
        topMenu={<DatesFilter link="/appointments" />}
      />
    </PageLayout>
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
        {/* <DashBoardTable columns={columns} data={data} /> */}
      </CardContent>
    </Card>
  );
};
