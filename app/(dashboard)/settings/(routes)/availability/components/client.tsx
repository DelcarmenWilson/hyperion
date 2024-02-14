"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DayHour } from "./day-hours";
import { Schedule } from "@prisma/client";
import { ScheduleSchema } from "@/schemas";
import { useState } from "react";
import { scheduleUpdateByUserId } from "@/actions/schedule";
import Link from "next/link";

type AvailabilityClientProps = {
  username: string;
  schedule: Schedule;
};
type ScheduleFormValues = z.infer<typeof ScheduleSchema>;

export function AvailabilityClient({
  username,
  schedule,
}: AvailabilityClientProps) {
  const [loading, setLoading] = useState(false);
  const [sunday, setSunday] = useState(schedule.sunday);
  const [monday, setMonday] = useState(schedule.monday);
  const [tuesday, setTuesday] = useState(schedule.tuesday);
  const [wednesday, setWednesday] = useState(schedule.wednesday);
  const [thursday, setThursday] = useState(schedule.thursday);
  const [friday, setFriday] = useState(schedule.friday);
  const [saturday, setSaturday] = useState(schedule.saturday);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: schedule,
  });

  const onSubmit = async (values: ScheduleFormValues) => {
    setLoading(true);
    values.sunday = sunday;
    values.monday = monday;
    values.tuesday = tuesday;
    values.wednesday = wednesday;
    values.thursday = thursday;
    values.friday = friday;
    values.saturday = saturday;
    // console.log(values);
    // setLoading(false);

    // return;

    await scheduleUpdateByUserId(values).then((data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:w-2/3 pl-2">
        {/* TYPE */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
              <div className="space-y-0.5">
                <FormLabel>Schedule Type</FormLabel>
                <FormDescription>Set prefer scheduling type</FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4 space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="half" />
                    </FormControl>
                    <FormLabel className="font-normal">Half Hour</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hourly" />
                    </FormControl>
                    <FormLabel className="font-normal">Hourly</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-right w-full text-sm text-primary mt-0">
          <Link
            href={`/book/${username}`}
            className="text-right w-full text-sm text-primary"
            target="_blank"
          >
            Booking page : {`/book/${username}`}
          </Link>
        </p>
        {/*TILTE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={loading}
                  placeholder=""
                  autoComplete="title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*SUB TILTE */}
        <FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Sub title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={loading}
                  placeholder=""
                  autoComplete="sub-title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col rounded-lg border p-3 shadow-sm mt-3">
          <div className="grid grid-cols-5 text-center items-center gap-2 text-sm mb-2">
            <p className="text-left">Weekdays</p>
            <p className="col-span-2 text-muted-foreground">Working Hours</p>
            <p className="col-span-2 text-muted-foreground">Break</p>
          </div>
          <DayHour
            day="Sunday"
            hours={sunday}
            setHours={setSunday}
            disabled={loading}
          />
          <DayHour
            day="Monday"
            hours={monday}
            setHours={setMonday}
            disabled={loading}
          />
          <DayHour
            day="Tuesday"
            hours={tuesday}
            setHours={setTuesday}
            disabled={loading}
          />
          <DayHour
            day="Wednesday"
            hours={wednesday}
            setHours={setWednesday}
            disabled={loading}
          />
          <DayHour
            day="Thursday"
            hours={thursday}
            setHours={setThursday}
            disabled={loading}
          />
          <DayHour
            day="Friday"
            hours={friday}
            setHours={setFriday}
            disabled={loading}
          />
          <DayHour
            day="Saturday"
            hours={saturday}
            setHours={setSaturday}
            disabled={loading}
          />
        </div>
        <div className="text-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
