"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useScheduleActions } from "@/hooks/use-schedule";

import { Schedule } from "@prisma/client";
import { ScheduleSchema, ScheduleSchemaType } from "@/schemas/settings";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScheduleBreakModal } from "@/components/modals/schedule-break";
import { DayHour } from "./day-hours";
import { ScrollArea } from "@/components/ui/scroll-area";

//TODO need to look into refactoring this entire component
type AvailabilityClientProps = {
  username: string;
  schedule: Schedule;
};
export function AvailabilityClient({
  username,
  schedule,
}: AvailabilityClientProps) {
  const {
    loading,
    brSchedule,
    onSetDay,
    onSetAvailable,
    onSetWorkHours,
    onSubmit,
  } = useScheduleActions(schedule);

  const form = useForm<ScheduleSchemaType>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: schedule,
  });

  return (
    <ScrollArea>
      <ScheduleBreakModal setDay={onSetDay} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mr-2 space-y-2">
          <div className="lg:w-2/3">
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

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Schedule Type</FormLabel>
                    <FormDescription>
                      Set prefer scheduling type
                    </FormDescription>
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
          </div>
          <FormLabel> Schedule</FormLabel>
          <div className="flex flex-col rounded-lg border p-3 shadow-sm mt-3 me-2 pe-2">
            <div className="grid grid-cols-5 text-center items-center gap-2 text-sm mb-2">
              <p className="text-left">Weekdays</p>
              <p className="col-span-2 text-muted-foreground">Working Hours</p>
              <p className="col-span-2 text-muted-foreground">Break</p>
            </div>
            {brSchedule.map((day, i) => (
              <DayHour
                key={i}
                schedule={day}
                disabled={loading}
                onSetAvail={onSetAvailable}
                onSetWorkHours={onSetWorkHours}
              />
            ))}
          </div>
          <div className="text-end mt-2">
            <Button type="submit">Update Availability</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
