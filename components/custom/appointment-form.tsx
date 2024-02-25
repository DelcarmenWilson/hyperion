"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
import { useAppointmentContext } from "@/providers/appointment-provider";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
<<<<<<< HEAD
import { concateDate, getTommorrow, getYesterday } from "@/formulas/dates";
import { AppointmentSchema } from "@/schemas";
=======
import {
  concateDate,
  getToday,
  getTommorrow,
  getYesterday,
} from "@/formulas/dates";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
>>>>>>> parent of 9f16759 (sales-pipeline)

export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  const { lead, onClose } = useAppointmentModal();

  const [calOpen, setCalOpen] = useState(false);
  const [available, setAvailable] = useState(true);
<<<<<<< HEAD
  const [brSchedule] = useState<BrokenScheduleType[]>(
    breakDownSchedule(schedule!)
  );
=======
  const [brSchedule, setBrSchedule] = useState<BrokenScheduleType[]>();
>>>>>>> parent of 9f16759 (sales-pipeline)
  const [times, setTimes] = useState<ScheduleTimeType[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [date, setDate] = useState<Date>(getTommorrow);
  const [time, setTime] = useState("");
  const [comments, setComments] = useState("");

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setDate(date);
    const day = date.getDay();
    if (!brSchedule) return;
    if (brSchedule[day].day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(brSchedule[day]);
      setTimes(sc);
      setAvailable(true);
    }

    const currentapps = appointments?.filter(
      (e) => new Date(e.date).toDateString() == date.toDateString()
    );

    setTimes((times) => {
      return times?.map((time) => {
        time.disabled = false;
        const oldapp = currentapps?.find(
          (e) => new Date(e.date).toLocaleTimeString() == time.value
        );
        if (oldapp) {
          time.disabled = true;
        }
        return time;
      });
    });

    setCalOpen(false);
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const newDate = concateDate(date, time);
    if (!time) return;
    const appointment: z.infer<typeof AppointmentSchema> = {
      date: newDate,
      agentId: user?.id!,
      leadId: lead?.id!,
      comments: comments,
    };

    await appointmentInsert(appointment).then((data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });

    setLoading(false);
  };

  useEffect(() => {
    const loadAppointments = () => {
      axios
        .post("/api/user/appointments", { user: user?.id })
        .then((response) => {
          setAppointments(response.data);
        });
    };
    return () => loadAppointments();
  }, [date]);

  useEffect(() => {
    const initialLoad = () => {
      axios.post("/api/user/schedule", { user: user?.id }).then((response) => {
        setBrSchedule(breakDownSchedule(response.data));
        OnDateSlected(new Date());
      });
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
              {/* <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(e) => OnDateSlected(e!)}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              /> */}
              <Popover open={calOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    onClick={() => setCalOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
