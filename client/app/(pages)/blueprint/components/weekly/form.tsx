import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBluePrintStore, useBluePrintActions } from "@/hooks/use-blueprint";

import {
  BluePrintWeekSchema,
  BluePrintWeekSchemaType,
} from "@/schemas/blueprint";

import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { daysOfTheWeek } from "@/formulas/schedule";

export const BluePrintWeekForm = () => {
  const { bluePrintWeek, isBluePrintWeekFormOpen, onBluePrintWeekFormClose } =
    useBluePrintStore();
  const { onBluePrintWeekUpdate } = useBluePrintActions(
    onBluePrintWeekFormClose
  );

  const form = useForm<BluePrintWeekSchemaType>({
    resolver: zodResolver(BluePrintWeekSchema),
    defaultValues: bluePrintWeek,
  });

  useEffect(() => {
    if (!bluePrintWeek) return;
    const { id, calls, appointments, premium } = bluePrintWeek;
    form.setValue("id", id);
    form.setValue("calls", calls);
    form.setValue("appointments", appointments);
    form.setValue("premium", premium);
  }, [bluePrintWeek]);

  return (
    <CustomDialog
      open={isBluePrintWeekFormOpen}
      onClose={onBluePrintWeekFormClose}
      title="Edit current week blueprint (Test)"
      description="Blue Print Week Form"
    >
      <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center max-h-[400px] p-2 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onBluePrintWeekUpdate)}>
            {/* CALLS */}
            <FormField
              control={form.control}
              name="calls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Calls
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Calls Made" />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* APPOINTMENTS */}
            <FormField
              control={form.control}
              name="appointments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Appointments
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Appointments Made" />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* PREMIUM */}
            <FormField
              control={form.control}
              name="premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Premium
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Premium Earned" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex mt-2 gap-2 justify-end">
              <Button
                variant="outlineprimary"
                type="button"
                onClick={onBluePrintWeekFormClose}
              >
                Cancel
              </Button>
              <Button>Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomDialog>
  );
};

type WorkingDaysProps = {
  defaultValue: string;
  onChange: (e: string) => void;
};
const WorkingDays = ({ defaultValue, onChange }: WorkingDaysProps) => {
  const [days, setDays] = useState<string[]>(
    defaultValue ? defaultValue.split(",") : []
  );

  const onSetDay = (day: string) => {
    if (days.includes(day)) {
      setDays((prevdays) => prevdays.filter((e) => e != day));
    } else setDays((prevdays) => [...prevdays, day]);
  };
  const concateDays = days.join(",");
  return (
    <div className="flex flex-wrap gap-2">
      {daysOfTheWeek.map((day) => (
        <Button
          key={day}
          variant={days.includes(day) ? "default" : "outlineprimary"}
          size="sm"
          onClick={() => onSetDay(day)}
          type="button"
        >
          {day}
        </Button>
      ))}

      <Button
        className="ml-auto"
        disabled={defaultValue == concateDays}
        size={"sm"}
        variant="success"
        type="button"
        onClick={() => onChange(concateDays)}
      >
        Save
      </Button>
    </div>
  );
};

const WorkingHours = ({ defaultValue, onChange }: WorkingDaysProps) => {
  const [hours, setHours] = useState<{ from: string; to: string }>({
    from: defaultValue ? defaultValue.split("-")[0] : "",
    to: defaultValue ? defaultValue.split("-")[1] : "",
  });

  const onSetHours = (type: "from" | "to", value: string) => {
    setHours((prevHours) => ({ ...prevHours, [type]: value }));
  };

  const concateHours = hours.from.concat("-", hours.to);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <Input
        name="txtFrom"
        type="time"
        defaultValue={hours.from}
        autoComplete="time"
        onChange={(e) => onSetHours("from", e.target.value)}
      />
      <Input
        name="txtTo"
        type="time"
        defaultValue={hours.to}
        autoComplete="time"
        onChange={(e) => onSetHours("to", e.target.value)}
      />

      <div className="col-span-2 text-end">
        <Button
          className="ml-auto"
          disabled={defaultValue == concateHours}
          size={"sm"}
          variant="success"
          type="button"
          onClick={() => onChange(concateHours)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
