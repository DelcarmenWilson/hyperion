"use client";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { PageLayout } from "@/components/custom/layout/page-layout";
import { TopMenu } from "./top-menu";
import { DatesFilter } from "@/components/reusable/dates-filter";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

import { FullAppointment } from "@/types";

type AppointmentClientProps = {
  data: FullAppointment[];
  showDate?: boolean;
  showLink?: boolean;
};

export const AppointmentClient = ({
  data,
  showDate = false,
  showLink = false,
}: AppointmentClientProps) => {
  const [appointments, setAppointments] = useState(data);
  const user = useCurrentUser();
  useEffect(() => {
    const appointmentHandler = (appointment: FullAppointment) => {
      setAppointments((current) => {
        const existingAppointment = current.find((e) => e.id == appointment.id);
        if (existingAppointment) {
          return current;
        }
        return [...current, appointment];
      });
    };
  }, [user?.id]);

  return (
    <PageLayout
      title="Appointments"
      icon={Calendar}
      topMenu={<TopMenu showLink={showLink} />}
    >
      <DataTable
        columns={columns}
        data={appointments}
        headers
        topMenu={showDate ? <DatesFilter link="/appointments" /> : null}
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
