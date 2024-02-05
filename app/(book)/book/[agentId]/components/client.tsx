"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gender, Lead, MaritalStatus, Schedule } from "@prisma/client";
import { Appointment } from "@prisma/client";

import {
  generateScheduleTimes,
  breakDownSchedule,
  BrokenScheduleType,
  ScheduleTimeType,
} from "@/constants/schedule-times";
import { states } from "@/constants/states";
import { AppointmentLeadSchema } from "@/schemas";
import { Badge } from "@/components/ui/badge";
import { concateDate } from "@/formulas/dates";
import { appointmentInsertBook } from "@/actions/appointment";

interface BookAgentClientProps {
  schedule: Schedule;
  lead?: z.infer<typeof AppointmentLeadSchema>;
  appointments: Appointment[];
}
type LeadFormValues = z.infer<typeof AppointmentLeadSchema>;

export const BookAgentClient = ({
  schedule,
  lead,
  appointments,
}: BookAgentClientProps) => {
  const tommorrow = new Date().setDate(new Date().getDate() + 1);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [brSchedule, setBrSchedule] = useState<BrokenScheduleType[]>(
    breakDownSchedule(schedule)
  );
  const [times, setTimes] = useState<ScheduleTimeType[]>();
  const [selectedDate, setselectedDate] = useState(new Date(tommorrow));
  const [selectedTime, setselectedTime] = useState("");

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setselectedDate(date);
    const day = date.getDay();
    if (brSchedule[day].day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(brSchedule[day]);
      setTimes(sc);
      setAvailable(true);
    }

    const currentapps = appointments.filter(
      (e) => e.date.toDateString() == date.toDateString()
    );

    setTimes((times) => {
      return times?.map((time) => {
        time.disabled = false;
        const oldapp = currentapps.find(
          (e) => e.date.toLocaleTimeString() == time.value
        );
        if (oldapp) {
          time.disabled = true;
        }
        return time;
      });
    });
  };

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(AppointmentLeadSchema),
    defaultValues: lead || {
      firstName: "",
      lastName: "",
      state: "",
      cellPhone: "",
      gender: Gender.Male,
      maritalStatus: MaritalStatus.Single,
      email: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: LeadFormValues) => {
    setLoading(true);
    const newDate = concateDate(selectedDate, selectedTime);
    await appointmentInsertBook(values, schedule.userId, newDate).then(
      (data) => {
        if (data.success) {
          toast.success(data.success);
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    OnDateSlected(selectedDate);
  }, []);

  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col gap-2 w-[600px]">
        <div className="flex flex-col justify-center items-center text-center gap-2 ">
          <Image
            src="/assets/wdelcarmen.jpg"
            width={80}
            height={80}
            className="w-auto h-auto"
            alt="Profile Image"
          />
          <p className="font-bold text-2xl">{schedule.title}</p>
          <p className="text-sm">{schedule.subTitle}</p>
        </div>{" "}
        <Tabs
          defaultValue="schedule"
          className="pt-2 border border-t-0 border-b-0"
        >
          <div className="px-2">
            <TabsContent value="schedule">
              <div className="grid grid-cols-2">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(e) => OnDateSlected(e!)}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {available ? (
                    <div className="grid grid-cols-4 font-bold text-sm gap-2">
                      {times?.map((time) => (
                        <Button
                          variant={
                            selectedTime == time.value
                              ? "default"
                              : "outlineprimary"
                          }
                          disabled={time.disabled}
                          key={time.value}
                          onClick={() => setselectedTime(time.value)}
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
                </div>
              </div>
              {selectedTime && (
                <TabsList className="w-full justify-end">
                  <TabsTrigger value="info">
                    <Button variant="outlineprimary">Next</Button>
                  </TabsTrigger>
                </TabsList>
              )}
            </TabsContent>
            <TabsContent value="info">
              <TabsList className="w-full">
                <TabsTrigger className="w-full flex gap-2" value="schedule">
                  <Badge>Date: {selectedDate.toDateString()}</Badge>
                  <Badge>Time: {selectedTime}</Badge>
                  <Button className="ml-auto" variant="outlineprimary">
                    Back
                  </Button>
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-col">
                <p className="font-semibold">
                  Please provide some general information about yourself
                </p>
                <Form {...form}>
                  <form
                    className="space-6 px-2 w-full"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div>
                      <div className="flex flex-col gap-2">
                        {/* FIRSTNAME */}
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  disabled={loading}
                                  autoComplete="First Name"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* LASTNAME */}
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  disabled={loading}
                                  autoComplete="Last Name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* GENDER */}
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> Gender</FormLabel>
                              <Select
                                name="ddlGender"
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={Gender.Male}>
                                    Male
                                  </SelectItem>
                                  <SelectItem value={Gender.Female}>
                                    Female
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        {/* CELLPHONE */}
                        <FormField
                          control={form.control}
                          name="cellPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> Cell Phone</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="555-555-5555"
                                  disabled={loading}
                                  autoComplete="phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* MARITAL STATUS */}
                        <FormField
                          control={form.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> Marital Status</FormLabel>
                              <Select
                                name="ddlMaritalStatus"
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={MaritalStatus.Single}>
                                    Single
                                  </SelectItem>
                                  <SelectItem value={MaritalStatus.Married}>
                                    Married
                                  </SelectItem>
                                  <SelectItem value={MaritalStatus.Divorced}>
                                    Divorced
                                  </SelectItem>
                                  <SelectItem value={MaritalStatus.Widowed}>
                                    Widowed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* EMAIL */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="jon.doe@example.com"
                                  disabled={loading}
                                  autoComplete="email"
                                  type="email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        {/* STATE */}
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> State</FormLabel>
                              <Select
                                name="ddlState"
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                autoComplete="address-level1"
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem
                                      key={state.abv}
                                      value={state.abv}
                                    >
                                      {state.state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                      <Button
                        onClick={onCancel}
                        type="button"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button disabled={loading} type="submit">
                        Set appointment
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
