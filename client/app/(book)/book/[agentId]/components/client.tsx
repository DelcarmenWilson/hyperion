"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Gender, MaritalStatus, Schedule } from "@prisma/client";
import { Appointment } from "@prisma/client";
import {
  AppointmentLeadSchema,
  AppointmentLeadSchemaType,
} from "@/schemas/appointment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { states } from "@/constants/states";

import { getTommorrow } from "@/formulas/dates";
import {
  breakDownSchedule,
  generateScheduleTimes,
  NewScheduleTimeType,
} from "@/formulas/schedule";
import { appointmentInsertBook } from "@/actions/appointment";

type BookAgentClientProps = {
  userImage: string;
  schedule: Schedule;
  lead?: AppointmentLeadSchemaType;
  appointments: Appointment[];
};

export const BookAgentClient = ({
  userImage,
  schedule,
  lead,
  appointments,
}: BookAgentClientProps) => {
  const tommorrow = getTommorrow();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const brSchedule = breakDownSchedule(schedule);

  const [times, setTimes] = useState<NewScheduleTimeType[]>();
  const [selectedDate, setSelectedDate] = useState(tommorrow);
  const [selectedTime, setSelectedTime] = useState<
    NewScheduleTimeType | undefined
  >();

  const OnDateSlected = (date: Date) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(undefined);
    const selectedDay = brSchedule[date.getDay()];
    if (selectedDay.day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(date, selectedDay);
      setTimes(sc);
      setAvailable(true);
    }

    const currentapps = appointments.filter(
      (e) => e.startDate.toDateString() == date.toDateString()
    );

    setTimes((times) => {
      return times?.map((time) => {
        time.disabled = false;
        const oldapp = currentapps.find(
          (e) =>
            e.startDate.toLocaleTimeString() ==
            time.agentDate.toLocaleTimeString()
        );
        if (oldapp) {
          time.disabled = true;
        }
        return time;
      });
    });
  };

  const form = useForm<AppointmentLeadSchemaType>({
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

  const onSubmit = async (values: AppointmentLeadSchemaType) => {
    if (!selectedTime) return;
    setLoading(true);

    const insertedAppointment = await appointmentInsertBook(
      values,
      schedule.userId,
      selectedTime.agentDate,
      selectedTime.localDate
    );

    if (insertedAppointment.success) toast.success(insertedAppointment.success);
    else {
      form.reset();
      toast.error(insertedAppointment.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => OnDateSlected(selectedDate);
  }, []);

  return (
    <div className="flex-center h-full p-4 overflow-hidden">
      <div className="flex-center flex-col gap-2 w-full lg:w-[600px] h-full bg-background rounded-md p-4 overflow-hidden">
        <div className="flex-center flex-col text-center gap-2 border-b ">
          <Avatar className="w-[100px] h-auto rounded-md">
            <AvatarImage src={userImage || ""} />
            <AvatarFallback className="w-[100px] h-[100px] rounded-md bg-primary">
              <FaUser size={25} className="text-accent" />
            </AvatarFallback>
          </Avatar>
          <p className="font-bold text-2xl">{schedule.title}</p>
          <p className="text-sm">{schedule.subTitle}</p>
        </div>
        <Tabs
          defaultValue="schedule"
          className="pt-2 w-full flex-1 overflow-y-auto"
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
                  <h4 className="text-center">{selectedDate.toDateString()}</h4>
                  <div className="flex-center flex-1">
                    {available ? (
                      <div className="grid grid-cols-4 font-bold text-sm gap-2">
                        {times?.map((tm) => (
                          <Button
                            variant={
                              selectedTime?.localDate == tm.localDate
                                ? "default"
                                : "outlineprimary"
                            }
                            disabled={tm.disabled}
                            key={tm.text}
                            onClick={() => setSelectedTime(tm)}
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
                  </div>
                </div>
              </div>
              {selectedTime && (
                <TabsList className="bg-transparent w-full justify-end">
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
                  <Badge>Time: {selectedTime?.localDate.toTimeString()}</Badge>
                  <Button className="ml-auto" variant="outlineprimary">
                    Change
                  </Button>
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-col">
                <p className="font-semibold text-center p-2">
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
