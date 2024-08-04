import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { FullTimeInfo } from "@prisma/client";
import {
  FullTimeInfoSchema,
  FullTimeInfoSchemaType,
} from "@/schemas/blueprint";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TargetList } from "./list";

import {
  fullTimeInfoInsert,
  fullTimeInfoUpdateByUserId,
} from "@/actions/blueprint";
import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { daysOfTheWeek } from "@/formulas/schedule";

type FullTimeInfoFormProps = {
  fullTimeInfo?: FullTimeInfo;
  onClose: () => void;
};
export const FullTimeInfoForm = ({
  onClose,
  fullTimeInfo,
}: FullTimeInfoFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<FullTimeInfoSchemaType>({
    resolver: zodResolver(FullTimeInfoSchema),
    defaultValues: fullTimeInfo || {
      workType: "PartTime",
      workingHours: "09:00-17:00",
      workingDays: "saturday,sunday",
      targetType: "regular",
    },
  });
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  const fullTimeInfoFormSubmit = async (values: FullTimeInfoSchemaType) => {
    if (fullTimeInfo) {
      const updatedFullTimeInfo = await fullTimeInfoUpdateByUserId(values);
      if (updatedFullTimeInfo.error) {
        toast.error(updatedFullTimeInfo.error);
      } else {
        invalidate("agentFullTimeInfo");
        onClose();
        toast.success("Agent details got updated");
      }
    } else {
      const newFullTimeInfo = await fullTimeInfoInsert(values);
      if (newFullTimeInfo.error) {
        toast.error(newFullTimeInfo.error);
      } else {
        ["agentFullTimeInfo", "agentBluePrints"].forEach((key) =>
          invalidate(key)
        );
        onClose();
        toast.success("Agent details got updated");
      }
    }
  };

  return (
    <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center max-h-[400px] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(fullTimeInfoFormSubmit)}>
          {/* WORK TYPE */}
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Work Type
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddl-workType"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  autoComplete="workType"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Parttime" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PartTime">Part Time</SelectItem>
                    <SelectItem value="FullTime">Full Time</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {/* WORKING DAYS */}
          <FormField
            control={form.control}
            name="workingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Working Days
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <WorkingDays
                    defaultValue={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* WORKING HOURS */}
          <FormField
            control={form.control}
            name="workingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Working Hours
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  {/* <Input {...field} placeholder="Please enter workingHours" /> */}
                  <WorkingHours
                    defaultValue={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* ANNUAL TARGET */}
          <FormField
            control={form.control}
            name="annualTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Annual Target
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter annual target" />
                </FormControl>
              </FormItem>
            )}
          />
          {/* TARGET TYPE */}
          <FormField
            control={form.control}
            name="targetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Target Type
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <TargetList
                    targets={calculateWeeklyBluePrint(
                      form.getValues("annualTarget")
                    )}
                    selectedTarget={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex mt-2 gap-2 justify-end">
            <Button variant="outlineprimary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

type Props = {
  defaultValue: string;
  onChange: (e: string) => void;
};
const WorkingDays = ({ defaultValue, onChange }: Props) => {
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

const WorkingHours = ({ defaultValue, onChange }: Props) => {
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
