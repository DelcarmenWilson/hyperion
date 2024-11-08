import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBluePrintStore, useBluePrintActions } from "@/hooks/use-blueprint";

import {
  AgentWorkInfoSchema,
  AgentWorkInfoSchemaType,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TargetList } from "./list";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { daysOfTheWeek } from "@/formulas/schedule";
import { AgentWorkInfo } from "@prisma/client";

export const AgentWorkInfoFormDialog = () => {
  const { workInfo, isWorkInfoFormOpen, onWorkInfoFormClose } =
    useBluePrintStore();
  const {
    onAgentWorkInfoInsert,
    agentWorkInfoInserting,
    onAgentWorkInfoUpdate,
    agentWorkInfoUpdating,
  } = useBluePrintActions();

  return (
    <CustomDialog
      open={isWorkInfoFormOpen}
      onClose={onWorkInfoFormClose}
      title="Work Details"
      description="Agent Work Info Form"
    >
      <AgentWorkInfoForm
        workInfo={workInfo}
        onClose={onWorkInfoFormClose}
        submit={workInfo ? onAgentWorkInfoUpdate : onAgentWorkInfoInsert}
        loading={workInfo ? agentWorkInfoUpdating : agentWorkInfoInserting}
      />
    </CustomDialog>
  );
};

type AgentWorkInfoFormProps = {
  workInfo?: AgentWorkInfo | null;
  submit: (e: AgentWorkInfoSchemaType) => void;
  loading: boolean;
  onClose?: () => void;
};
const AgentWorkInfoForm = ({
  workInfo,
  submit,
  loading,
  onClose,
}: AgentWorkInfoFormProps) => {
  const form = useForm<AgentWorkInfoSchemaType>({
    resolver: zodResolver(AgentWorkInfoSchema),
    defaultValues: workInfo || {
      workType: "PartTime",
      workingHours: "09:00-17:00",
      workingDays: "saturday,sunday",
      targetType: "regular",
    },
  });

  return (
    <div className="flex-col items-start xl:flex-row xl:items-center max-h-[400px] p-2 overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-2">
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
                  disabled={loading}
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
                    loading={loading}
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
                    loading={loading}
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
                    disabled={loading}
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
                    loading={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex mt-2 gap-2 justify-end">
            <Button
              variant="outlineprimary"
              type="button"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={loading}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
type WorkingDaysProps = {
  defaultValue: string;
  loading: boolean;
  onChange: (e: string) => void;
};
const WorkingDays = ({ defaultValue, loading, onChange }: WorkingDaysProps) => {
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
          disabled={loading}
        >
          {day}
        </Button>
      ))}

      <Button
        className="ml-auto"
        disabled={defaultValue == concateDays || loading}
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

const WorkingHours = ({
  defaultValue,
  loading,
  onChange,
}: WorkingDaysProps) => {
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
        disabled={loading}
      />
      <Input
        name="txtTo"
        type="time"
        defaultValue={hours.to}
        autoComplete="time"
        onChange={(e) => onSetHours("to", e.target.value)}
        disabled={loading}
      />

      <div className="col-span-2 text-end">
        <Button
          className="ml-auto"
          disabled={defaultValue == concateHours || loading}
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
