"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, GoalIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBluePrintActions } from "@/hooks/use-blueprint";

import { AgentWorkInfo } from "@prisma/client";
import {
  CreateAgentWorkInfoSchema,
  CreateAgentWorkInfoSchemaType,
  UpdateAgentWorkInfoSchema,
  UpdateAgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomDialogHeader from "@/components/custom-dialog-header";
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

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TargetList } from "./list";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { daysOfTheWeek, daysOfTheWeek2 } from "@/formulas/schedule";
import { Checkbox } from "@/components/ui/checkbox";

export const CreateAgentWorkInfoDialog = ({
  triggerText = "Create Agent Work Info",
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateAgentWorkInfoSchemaType>({
    resolver: zodResolver(CreateAgentWorkInfoSchema),
    defaultValues: {
      workType: "PartTime",
      workingHours: "09:00-17:00",
      workingDays: "saturday,sunday",
      targetType: "regular",
    },
  });

  const { onAgentWorkInfoInsert, agentWorkInfoInserting } = useBluePrintActions(
    () => {
      setOpen(false);
    }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={GoalIcon} title="Create Agent Work Info" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAgentWorkInfoInsert)}
            className="flex flex-col gap-2"
          >
            <div className="flex-col items-start xl:flex-row xl:items-center max-h-[400px] p-2 overflow-hidden">
              <ScrollArea>
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
                        disabled={agentWorkInfoInserting}
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
                          loading={agentWorkInfoInserting}
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
                          loading={agentWorkInfoInserting}
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
                          disabled={agentWorkInfoInserting}
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
                          loading={agentWorkInfoInserting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </ScrollArea>
            </div>
            <div className="grid grid-cols-2 mt-auto gap-2">
              <Button
                variant="outlineprimary"
                type="button"
                disabled={agentWorkInfoInserting}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={agentWorkInfoInserting}>Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type UpdateAgentWorkInfoDialogProps = {
  workInfo: AgentWorkInfo;
  triggerText?: string;
};

export const UpdateAgentWorkInfoDialog = ({
  workInfo,
  triggerText = "Create Agent Work Info",
}: UpdateAgentWorkInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateAgentWorkInfoSchemaType>({
    resolver: zodResolver(UpdateAgentWorkInfoSchema),
    //@ts-ignore
    defaultValues: workInfo,
  });

  const { onAgentWorkInfoUpdate, agentWorkInfoUpdating } = useBluePrintActions(
    () => {
      setOpen(false);
    }
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="xs">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={GoalIcon} title="Update Agent Work Info" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAgentWorkInfoUpdate)}
            className="flex flex-col gap-2 p-1"
          >
            <div className="flex-col items-start xl:flex-row xl:items-center max-h-[400px] p-2 overflow-hidden">
              <ScrollArea>
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
                        disabled={agentWorkInfoUpdating}
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
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Sidebar</FormLabel>
                        <FormDescription>
                          Select the items you want to display in the sidebar.
                        </FormDescription>
                      </div>
                      {daysOfTheWeek2.map((item) => (
                        <FormField
                          key={item.value}
                          control={form.control}
                          name="workingDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
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
                          loading={agentWorkInfoUpdating}
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
                          disabled={agentWorkInfoUpdating}
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
                          loading={agentWorkInfoUpdating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </ScrollArea>
            </div>
            <div className="grid grid-cols-2 mt-auto gap-2">
              <Button
                variant="outlineprimary"
                type="button"
                disabled={agentWorkInfoUpdating}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="gap-2"
                disabled={!form.formState.isDirty || agentWorkInfoUpdating}
              >
                {agentWorkInfoUpdating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />

                    <span> Updating Details</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
        {/* </div> */}
      </DialogContent>
    </Dialog>
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
