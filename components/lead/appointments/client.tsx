"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { FullAppointment } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { DatesFilter } from "@/components/reusable/dates-filter";
import { useEffect, useState } from "react";
import { find } from "lodash";
import { Subscrible } from "@/lib/subscribable-class";
import { useCurrentUser } from "@/hooks/use-current-user";

type AppointmentClientProps = {
  data: FullAppointment[];
  showDate?: boolean;
};

export const AppointmentClient = ({
  data,
  showDate = false,
}: AppointmentClientProps) => {
  const [appointments, setAppointments] = useState(data);
  const user = useCurrentUser();
  useEffect(() => {
    const appointmentHandler = (appointment: FullAppointment) => {
      console.log(appointment);
      setAppointments((current) => {
        if (find(current, { id: appointment.id })) {
          return current;
        }
        return [...current, appointment];
      });
    };
    const pusher = new Subscrible<FullAppointment>();
    pusher.subscribe(appointmentHandler);
  }, [user?.id]);

  return (
    <DataTable
      columns={columns}
      data={appointments}
      headers
      topMenu={showDate ? <DatesFilter link="/appointments" /> : null}
    />
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
