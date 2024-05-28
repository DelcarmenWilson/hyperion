"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAppointmentContext } from "@/providers/app";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { appointmentInsert } from "@/actions/appointment";
import {
  BrokenScheduleType,
  ScheduleTimeType,
  breakDownSchedule,
  generateScheduleTimes,
} from "@/constants/schedule-times";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { concateDate, getTommorrow, getYesterday } from "@/formulas/dates";
import { AppointmentSchemaType } from "@/schemas/appointment";

export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  const { lead, onClose } = useAppointmentModal();
  const { schedule, appointments, setAppointments } = useAppointmentContext();

  const [calOpen, setCalOpen] = useState(false);
  const [available, setAvailable] = useState(true);
  const [brSchedule] = useState<BrokenScheduleType[]>(
    breakDownSchedule(schedule!)
  );
  const [times, setTimes] = useState<ScheduleTimeType[]>();
  const [date, setDate] = useState<Date>(getTommorrow);
  const [time, setTime] = useState("");
  const [comments, setComments] = useState("");

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setDate(date);
    const day = date.getDay();
    if (!brSchedule) return;

    const currentapps = appointments?.filter(
      (e) => new Date(e.startDate).toDateString() == date.toDateString()
    );

    if (brSchedule[day].day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(brSchedule[day]);
      setTimes(sc);
      setAvailable(true);
    }

    setTimes((times) => {
      return times?.map((time) => {
        time.disabled = false;
        const oldapp = currentapps?.find(
          (e) => new Date(e.startDate).toLocaleTimeString() == time.value
        );
        if (oldapp) {
          time.disabled = true;
        }
        return time;
      });
    });

    setCalOpen(false);
  };

  const onCancel = () => onClose();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const newDate = concateDate(date, time, user?.role == "ASSISTANT");
    if (!time) return;
    const appointment: AppointmentSchemaType = {
      startDate: newDate,
      agentId: user?.id!,
      leadId: lead?.id!,
      label: "blue",
      comments: comments,
    };

    appointmentInsert(appointment).then((data) => {
      if (data.success) {
        //TODO - need to apply the dispatcher for this
        // setAppointments((apps) => {
        //   if (!apps) return apps;
        //   return [...apps!, data.success.appointment];
        // });
        userEmitter.emit("appointmentScheduled", data.success.appointment);
        userEmitter.emit("messageInserted", data.success.message!);
        toast.success("Appointment scheduled!");
        onCancel();
      }
      if (data.error) {
        toast.error(data.error);
      }
    });

    setLoading(false);
  };

  useEffect(() => {
    const initialLoad = () => {
      OnDateSlected(new Date());
    };
    return () => initialLoad();
  }, []);

  return (
    <div>
      <Separator className="my-2" />
      <form className="space-6 px-2 w-full" onSubmit={onSubmit}>
        <div>
          <div className="flex flex-col gap-2">
            <p className="text-xl text-primary text-center font-bold">
              {lead?.firstName} {lead?.lastName}
            </p>

            {/* DATE*/}

            <div className="flex justify-center items-center flex-col pt-2">
              <Popover open={calOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal gap-2",
                      !date && "text-muted-foreground"
                    )}
                    onClick={() => setCalOpen(true)}
                  >
                    <CalendarIcon size={16} />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(e) => OnDateSlected(e!)}
                    disabled={(date) =>
                      date <= getYesterday() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time*/}
            {available ? (
              <div className="grid grid-cols-4 font-bold text-sm gap-2">
                {times?.map((tm) => (
                  <Button
                    variant={time == tm.value ? "default" : "outlineprimary"}
                    disabled={tm.disabled}
                    key={tm.value}
                    onClick={() => setTime(tm.value)}
                    type="button"
                  >
                    {tm.text}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="flex flex-1 justify-center items-center text-2xl text-muted-foreground">
                Not Available
              </p>
            )}
            {/* COMMENTS */}
            <p> Comments</p>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="comments"
              disabled={loading}
              autoComplete="comments"
            />
          </div>
        </div>

        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
