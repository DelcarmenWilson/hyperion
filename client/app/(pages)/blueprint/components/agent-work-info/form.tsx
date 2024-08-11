import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { AgentWorkInfo } from "@prisma/client";
import {
  AgentWorkInfoSchema,
  AgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  agentWorkInfoInsert,
  agentWorkInfoUpdateByUserId,
} from "@/actions/blueprint/agent-work-info";
import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { daysOfTheWeek } from "@/formulas/schedule";
import { useBluePrint } from "@/hooks/use-blueprint";

export const AgentWorkInfoForm = () => {
  const { workInfo, isWorkInfoFormOpen, onWorkInfoFormClose } = useBluePrint();
  const queryClient = useQueryClient();
  const form = useForm<AgentWorkInfoSchemaType>({
    resolver: zodResolver(AgentWorkInfoSchema),
    defaultValues: workInfo || {
      workType: "PartTime",
      workingHours: "09:00-17:00",
      workingDays: "saturday,sunday",
      targetType: "regular",
    },
  });

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };

  const agentWorkInfoFormSubmit = async (values: AgentWorkInfoSchemaType) => {
    if (workInfo) {
      const updatedFullTimeInfo = await agentWorkInfoUpdateByUserId(values);
      if (updatedFullTimeInfo.error) {
        toast.error(updatedFullTimeInfo.error);
      } else {
        invalidate("agentFullTimeInfo");
        onWorkInfoFormClose();
        toast.success("Agent details got updated");
      }
    } else {
      const insertedAgentWorkInfo = await agentWorkInfoInsert(values);
      if (insertedAgentWorkInfo.error) {
        toast.error(insertedAgentWorkInfo.error);
      } else {
        ["agentWorkInfo", "agentBluePrints", "agentBluePrintsWeekly"].forEach(
          (key) => invalidate(key)
        );
        onWorkInfoFormClose();
        toast.success("Agent details got updated");
      }
    }
  };

  return (
    <Dialog open={isWorkInfoFormOpen} onOpenChange={onWorkInfoFormClose}>
      <DialogContent>
        <h3 className="text-2xl font-semibold py-2">Work Details</h3>
        <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center max-h-[400px] p-2 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(agentWorkInfoFormSubmit)}>
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
                      <Input
                        {...field}
                        placeholder="Please enter annual target"
                      />
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
                <Button
                  variant="outlineprimary"
                  type="button"
                  onClick={onWorkInfoFormClose}
                >
                  Cancel
                </Button>
                <Button>Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
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
