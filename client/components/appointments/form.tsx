"use client";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useAppointmentData } from "@/hooks/use-appointment";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardData } from "@/components/reusable/card-data";
import { DrawerRight } from "../custom/drawer-right";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import {
  formatDate,
  formatDateTime,
  formatTimeZone,
  getYesterday,
} from "@/formulas/dates";
import { useCurrentUser } from "@/hooks/use-current-user";
import SkeletonWrapper from "../skeleton-wrapper";

export const AppointmentForm = () => {
  const {
    leadBasic,
    isFetchingLeadBasic,
    loading,
    form,
    onDateSelected,
    onSetSelectedTime,
    times,
    stateData,
    calOpen,
    setCalOpen,
    isFormOpen,
    onFormClose,
    available,
    onSubmit,
  } = useAppointmentData();
  const dt = form.getValues("date")?.getDate();
  const app = leadBasic?.appointments[0];

  return (
    <DrawerRight
      title="New appointment"
      isOpen={isFormOpen}
      onClose={onFormClose}
    >
      <SkeletonWrapper isLoading={isFetchingLeadBasic} fullHeight>
        <Form {...form}>
          <form
            className="space-y-2 px-2 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <p className="text-xl text-primary text-center font-bold">
              {leadBasic?.firstName} {leadBasic?.lastName}
            </p>
            <CardData label="Time Zone" center value={stateData?.zone} />
            <CardData
              label="Lead's Time"
              center
              value={formatTimeZone(new Date(), stateData?.zone)}
            />
            {app && (
              <div className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm mt-3 text-sm bg-primary/25">
                <p className="text-xl text-center">
                  {leadBasic.firstName} already has an appointment scheduled
                </p>
                <CardData
                  label="Date"
                  center
                  value={formatDateTime(app.startDate)}
                />
                <p className="font-bold text-xs">
                  * creating a new appointment will replace this one.
                </p>
              </div>
            )}

            {/* SMS REMINDER */}
            <FormField
              control={form.control}
              name="localDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {available ? (
                      <>
                        <div className="grid grid-cols-4 font-bold text-sm gap-2">
                          {times?.map((tm) => (
                            <Button
                              className="flex-col"
                              variant={
                                field.value?.getTime() == tm.localDate.getTime()
                                  ? "default"
                                  : "outlineprimary"
                              }
                              disabled={tm.disabled}
                              key={tm.text}
                              onClick={() => onSetSelectedTime(tm)}
                              type="button"
                            >
                              {tm.text}
                              {tm.localDate.getDate() != dt && (
                                <span className="text-xs">
                                  {format(tm.localDate, "MM-dd")}
                                </span>
                              )}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground col-span-4">
                          * The above times are converted to the leads timezone
                        </p>
                      </>
                    ) : (
                      <p className="flex flex-1 justify-center items-center text-2xl text-muted-foreground">
                        Not Available
                      </p>
                    )}
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DATE*/}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="text-center py-2">
                  <Popover open={calOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal gap-2",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setCalOpen((state) => !state)}
                      >
                        <CalendarIcon size={16} />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(e) => onDateSelected(e!)}
                          disabled={(date) =>
                            date <= getYesterday() ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </FormControl>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* COMMENTS */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Comments
                    <FormMessage />
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="comments"
                      disabled={loading}
                      autoComplete="comments"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* SMS REMINDER */}
            <FormField
              control={form.control}
              name="smsReminder"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="flex flex-col space-y-0.5">
                    <FormLabel>SMS Reminder</FormLabel>

                    <span className="text-[0.8rem] text-muted-foreground">
                      Send Reminder Text
                    </span>
                  </div>

                  <FormControl>
                    <Switch
                      disabled={loading}
                      name="cblSmsReminder"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* EMAIL REMINDER */}
            <FormField
              control={form.control}
              name="emailReminder"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="flex flex-col space-y-0.5">
                    <FormLabel>Email Reminder</FormLabel>

                    <span className="text-[0.8rem] text-muted-foreground">
                      Send Reminder Emial
                    </span>
                  </div>

                  <FormControl>
                    <Switch
                      disabled={loading}
                      name="cblEmailReminder"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onFormClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                disabled={loading || !form.watch("localDate")}
                type="submit"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </SkeletonWrapper>
    </DrawerRight>
  );
};
