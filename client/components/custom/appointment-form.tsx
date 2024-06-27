"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { useAppointmentContext } from "@/providers/app";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppointment } from "@/hooks/use-appointment";
import { format } from "date-fns";

import { AppointmentSchemaType } from "@/schemas/appointment";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import { CardData } from "@/components/reusable/card-data";

import {
  formatTimeZone,
  getTommorrow,
  getYesterday,
  timeDifference,
} from "@/formulas/dates";

import { states } from "@/constants/states";
import {
  breakDownSchedule,
  generateScheduleTimes,
  NewScheduleTimeType,
  ScheduleDay,
} from "@/formulas/schedule";

import { appointmentInsert } from "@/actions/appointment";

//TODO - see if we can make this use a form instead
export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  const { lead, onFormClose } = useAppointment();
  const { schedule, appointments, setAppointments } = useAppointmentContext();

  const stateData = states.find((e) => e.abv == lead?.state);
  const timeDiff = timeDifference(stateData?.zone);

  const [calOpen, setCalOpen] = useState(false);
  const [available, setAvailable] = useState(true);
  const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule!));

  //APPOINTMENT VARIABLES
  const [times, setTimes] = useState<NewScheduleTimeType[]>();
  const [selectedDate, setSelectedDate] = useState<Date>(getTommorrow);
  const [selectedTime, setSelectedTime] = useState<
    NewScheduleTimeType | undefined
  >();
  const [comments, setComments] = useState("");
  const [reminder, setReminder] = useState(true);

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(undefined);
    const selectedDay = brSchedule[date.getDay()];
    if (!brSchedule) return;

    const currentapps = appointments?.filter(
      (e) =>
        new Date(e.startDate).toDateString() == date.toDateString() &&
        e.status.toLocaleLowerCase() == "scheduled"
    );
    const currentDate = new Date();
    let blocked = false;
    if (date.getDate() == currentDate.getDate()) {
      blocked = true;
    }
    if (selectedDay.day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(date, selectedDay, blocked, timeDiff);
      setTimes(sc);
      setAvailable(true);
    }

    setTimes((times) => {
      return times?.map((time) => {
        const oldapp = currentapps?.find(
          (e) =>
            new Date(e.startDate).toLocaleTimeString() ==
            time.agentDate.toLocaleTimeString()
        );
        if (oldapp) time.disabled = true;

        return time;
      });
    });

    setCalOpen(false);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedTime) return;
    setLoading(true);

    const appointment: AppointmentSchemaType = {
      localDate: selectedTime.localDate,
      startDate: selectedTime.agentDate,
      agentId: user?.id!,
      leadId: lead?.id!,
      label: "blue",
      comments: comments,
      reminder: reminder,
    };

    const insertedAppointment = await appointmentInsert(appointment);
    if (insertedAppointment.success) {
      // const newApps=[...appointments!,insertedAppointment.success.appointment]
      // setAppointments((apps) => {
      //   if (!apps) return apps;
      //   return [...apps!, insertedAppointment.success.appointment];
      // });
      userEmitter.emit(
        "appointmentScheduled",
        insertedAppointment.success.appointment
      );
      userEmitter.emit("messageInserted", insertedAppointment.success.message!);
      toast.success("Appointment scheduled!");
      onFormClose();
    } else toast.error(insertedAppointment.error);

    setLoading(false);
  };

  useEffect(() => {
    const initialLoad = () => {
      OnDateSlected(new Date());
    };
    return () => initialLoad();
  }, []);

  return (
    <form className="space-6 px-2 w-full" onSubmit={onSubmit}>
      <div>
        <div className="flex flex-col gap-2">
          <p className="text-xl text-primary text-center font-bold">
            {lead?.firstName} {lead?.lastName}
          </p>
          <CardData label="Time Zone" center value={stateData?.zone} />
          <CardData
            label="Lead's Time"
            center
            value={formatTimeZone(new Date(), stateData?.zone)}
          />

          {/* DATE*/}
          <div className="flex justify-center items-center flex-col pt-2">
            <Popover open={calOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal gap-2",
                    !selectedDate && "text-muted-foreground"
                  )}
                  onClick={() => setCalOpen(true)}
                >
                  <CalendarIcon size={16} />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
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
                  className="flex-col"
                  variant={
                    selectedTime?.localDate == tm.localDate
                      ? "default"
                      : "outlineprimary"
                  }
                  disabled={tm.disabled}
                  key={tm.text}
                  onClick={() => setSelectedTime(tm)}
                  type="button"
                >
                  {tm.text}
                  {tm.localDate.getDate() != selectedDate.getDate() && (
                    <span className="text-xs">
                      {format(tm.localDate, "MM-dd")}
                    </span>
                  )}
                </Button>
              ))}
              <p className="text-xs text-muted-foreground col-span-4">
                * The above times are converted to the leads timezone
              </p>
            </div>
          ) : (
            <p className="flex flex-1 justify-center items-center text-2xl text-muted-foreground">
              Not Available
            </p>
          )}
          {/* COMMENTS */}
          <Label>Comments</Label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="comments"
            disabled={loading}
            autoComplete="comments"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
        <div className="space-y-0.5">
          <Label>Reminder</Label>
          <p className="text-[0.8rem] text-muted-foreground">
            Send Lead Reminder Text
          </p>
        </div>
        <div>
          <Switch
            disabled={loading}
            name="cblRecord"
            checked={reminder}
            onCheckedChange={(e) => setReminder(e)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
        <Button onClick={onFormClose} type="button" variant="outline">
          Cancel
        </Button>
        <Button disabled={loading || selectedTime == undefined} type="submit">
          Create
        </Button>
      </div>
    </form>
  );
};
