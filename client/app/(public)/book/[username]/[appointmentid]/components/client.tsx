"use client";
import { FaUser } from "react-icons/fa";

import { Schedule } from "@prisma/client";
import { Appointment } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";

import { ScrollArea } from "@/components/ui/scroll-area";

import { formatTime } from "@/formulas/dates";
import { useAppointmentRescheduleFormActions } from "../../../hooks/use-appointment";

type Props = {
  userImage: string;
  schedule: Schedule;
  appointment: Appointment;
  appointments: Appointment[];
};

export const AppointmentRescheduleClient = ({
  userImage,
  schedule,
  appointment,
  appointments,
}: Props) => {
  const {
    loading,
    available,
    times,
    onSetSelectedTime,
    form,
    onSubmit,
    onDateSelected,
  } = useAppointmentRescheduleFormActions(
    appointment.id,
    appointments,
    schedule
  );

  return (
    <div className="flex flex-col w-full lg:w-[600px] h-full bg-background p-4 overflow-hidden">
      <div className="flex w-full gap-2 border-b p-2 ">
        <Avatar className="w-[100px] h-auto rounded-md">
          <AvatarImage src={userImage || ""} />
          <AvatarFallback className="w-[100px] h-[100px] rounded-md bg-primary">
            <FaUser size={25} className="text-accent" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-2xl">{schedule.title}</p>
          <p className="text-sm italic">{schedule.subTitle}</p>
        </div>
      </div>

      <Form {...form}>
        <form
          className="w-full h-full flex-1 overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ScrollArea className="h-full px-2 border border-md">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div>
                {/* DATE*/}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(e) => onDateSelected(e!)}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </FormItem>
                  )}
                />
                <div className="border">
                  <p className="text-center font-bold text-xl">
                    Appointment Details
                  </p>
                  <Badge className="w-[200px]">
                    Date: {appointment.localDate.toDateString()}
                  </Badge>
                  <Badge className="w-[200px]">
                    Time: {formatTime(appointment.localDate)}
                  </Badge>
                  <Badge className="w-[200px]">
                    Duration:{" "}
                    {schedule.type == "hourly" ? "1 hour" : "30 minutes"}
                  </Badge>
                  <Badge className="w-[200px]">Location: Phone</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 py-2">
                <p className="text-center p-2 italic bg-primary/25">
                  {form.watch("date")?.toDateString()}
                </p>

                {/* BOOKING TIME */}
                <FormField
                  control={form.control}
                  name="localDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {available ? (
                          <div className="grid grid-cols-4 font-bold text-sm gap-2">
                            {times?.map((tm) => (
                              <Button
                                variant={
                                  field.value?.getTime() ==
                                  tm.localDate.getTime()
                                    ? "default"
                                    : "outlineprimary"
                                }
                                disabled={tm.disabled}
                                key={tm.text}
                                onClick={() => onSetSelectedTime(tm)}
                                type="button"
                              >
                                {tm.text}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="flex-center flex-1  text-2xl text-muted-foreground">
                            Not Available
                          </p>
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="uppercase" disabled={loading} type="submit">
                Reschedule appointment
              </Button>
            </div>
          </ScrollArea>
        </form>
      </Form>
    </div>
  );
};
