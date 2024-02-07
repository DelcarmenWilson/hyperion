import { useEffect, useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AppointmentSchema } from "@/schemas";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { appointmentInsert } from "@/actions/appointment";
import axios from "axios";
import {
  BrokenScheduleType,
  ScheduleTimeType,
  breakDownSchedule,
  generateScheduleTimes,
} from "@/constants/schedule-times";
import { concateDate, getToday } from "@/formulas/dates";
import { Appointment } from "@prisma/client";

export const AppointmentForm = () => {
  const tommorrow = getToday();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();
  const { lead, onClose } = useAppointmentModal();

  const [available, setAvailable] = useState(true);
  const [brSchedule, setBrSchedule] = useState<BrokenScheduleType[]>();
  const [times, setTimes] = useState<ScheduleTimeType[]>();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [selectedDate, setselectedDate] = useState<Date>(tommorrow);
  const [selectedTime, setselectedTime] = useState("");
  const [comments, setComments] = useState("");

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setselectedDate(date);
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
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const newDate = concateDate(selectedDate, selectedTime);
    if (!selectedTime) return;
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
    axios.get("/api/user/schedule").then((response) => {
      setBrSchedule(breakDownSchedule(response.data));
    });
    axios.get("/api/user/appointments").then((response) => {
      setAppointments(response.data);
    });
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
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(e) => OnDateSlected(e!)}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />

              {/* <Popover>
                <div className="relative">
                  <Input value={selectedDate.toDateString()} />
                  <PopoverTrigger asChild>
                    <CalendarIcon className="absolute h-4 w-4 opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer" />
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(e) => OnDateSlected(e!)}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
            </div>

            {/* Time*/}
            {available ? (
              <div className="grid grid-cols-4 font-bold text-sm gap-2">
                {times?.map((time) => (
                  <Button
                    variant={
                      selectedTime == time.value ? "default" : "outlineprimary"
                    }
                    disabled={time.disabled}
                    key={time.value}
                    onClick={() => setselectedTime(time.value)}
                    type="button"
                  >
                    {time.text}
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
