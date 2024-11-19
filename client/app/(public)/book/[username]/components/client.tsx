"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useAppointmentFormActions } from "../../hooks/use-appointment";

import { Gender, MaritalStatus, Schedule } from "@prisma/client";
import { Appointment } from "@prisma/client";
import { LeadMainSchemaTypeP } from "@/schemas/lead";

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
import { ScrollArea } from "@/components/ui/scroll-area";

import { states } from "@/constants/states";
import { formatTime } from "@/formulas/dates";
import { cn } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";

type Props = {
  userId: string;
  userImage: string;
  schedule: Schedule;
  lead?: LeadMainSchemaTypeP;
  appointments: Appointment[];
};

export const BookAgentClient = ({
  userId,
  userImage,
  schedule,
  lead,
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
  } = useAppointmentFormActions(userId, lead, appointments, schedule);

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
          <Tabs defaultValue="schedule" className="w-full h-full ">
            <TabsContent
              value="schedule"
              className="h-full overflow-hidden p-2"
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
                {form.watch("localDate") && (
                  <TabsList className="bg-transparent w-full justify-end">
                    <TabsTrigger className="flex-center mt-2" value="info">
                      <Button variant="outlineprimary">Next</Button>
                    </TabsTrigger>
                  </TabsList>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="info" className="h-full overflow-hidden p-2">
              <div className="flex gap-2 p-2 border border-md h-full overflow-hidden">
                <div className="w-[300px] border-r">
                  <p className="text-center font-bold text-xl">
                    Appointment Details
                  </p>
                  <Badge className="w-[200px]">
                    Date: {form.watch("localDate")?.toDateString()}
                  </Badge>
                  <Badge className="w-[200px]">
                    Time: {formatTime(form.getValues("localDate"))}
                  </Badge>
                  <Badge className="w-[200px]">
                    Duration:{" "}
                    {schedule.type == "hourly" ? "1 hour" : "30 minutes"}
                  </Badge>
                  <Badge className="w-[200px]">Location: Phone</Badge>
                  <TabsList className="w-full bg-transparent">
                    <TabsTrigger className="flex-center mt-2" value="schedule">
                      <Button variant="outlineprimary">Change</Button>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ScrollArea className="h-full px-2 ">
                  <p className="font-semibold text-center p-2">
                    Please provide some general information about yourself
                  </p>

                  <div className="flex flex-col gap-2 px-2">
                    {/* FIRSTNAME */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            First Name
                            <FormMessage />
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              disabled={loading}
                              autoComplete="First Name"
                              type="text"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* LASTNAME */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            Last Name
                            <FormMessage />
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              disabled={loading}
                              autoComplete="Last Name"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* GENDER */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            Gender
                            <FormMessage />
                          </FormLabel>
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
                              <SelectItem value={Gender.Male}>Male</SelectItem>
                              <SelectItem value={Gender.Female}>
                                Female
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* DATE OF BIRTH */}
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                          <FormLabel className="flex justify-between items-center">
                            Date of birth
                            <FormMessage />
                          </FormLabel>
                          <FormControl>
                            {/* <Input
                              {...field}
                              placeholder="Dob"
                              disabled={loading}
                              type="date"
                              autoComplete="DateOfBirth"
                            /> */}
                            <ReactDatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              dateFormat="MM-dd-yy"
                              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* CELLPHONE */}
                    <FormField
                      control={form.control}
                      name="cellPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            Cell Phone <FormMessage />
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="555-555-5555"
                              disabled={loading}
                              autoComplete="phone"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* MARITAL STATUS */}
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            Marital Status
                            <FormMessage />
                          </FormLabel>
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
                        </FormItem>
                      )}
                    />

                    {/* EMAIL */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            Email
                            <FormMessage />
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="jon.doe@example.com"
                              disabled={loading}
                              autoComplete="email"
                              type="email"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* STATE */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            State
                            <FormMessage />
                          </FormLabel>
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
                                <SelectItem key={state.abv} value={state.abv}>
                                  {state.state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button disabled={loading} type="submit">
                        Schedule appointment
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};
