import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash, X } from "lucide-react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { useCalendarActions } from "@/hooks/calendar/use-calendar";

import { useAppointmentContext } from "@/providers/app";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AppointmentLabelSchema,
  AppointmentLabelSchemaType,
} from "@/schemas/appointment";
import { getLabelBgColor, labelClasses } from "@/formulas/labels";
import { EmptyCard } from "@/components/reusable/empty-card";
import { cn } from "@/lib/utils";

export const LabelModal = () => {
  const { setShowLabelModal, labels, selectedLabel, addLabel, updateLabel } =
    useCalendarStore();
  const {
    onAppointmentLabelUpsert,
    appointmentLabelInsertIsPending,
    appointmentLabelUpdateIsPending,
  } = useCalendarActions();
  const { dispatchCalAppointment } = useAppointmentContext();

  const form = useForm<AppointmentLabelSchemaType>({
    resolver: zodResolver(AppointmentLabelSchema),
    //@ts-ignore
    defaultValues: selectedLabel || {
      id: "",
      color: labelClasses[0],
      checked: true,
    },
  });

  return (
    <div className="flex-center absolute inset-0">
      <div className="flex-center h-[300px] w-full">
        <div className="bg-background rounded-lg shadow-2xl w-[600px]">
          <header className="flex bg-secondary p-2  justify-between items-center">
            <h4 className="font-bold">Add New Label</h4>
            <div className="flex items-center gap-2">
              {selectedLabel && (
                <span
                  onClick={() => {
                    dispatchCalAppointment({
                      type: "delete_label",
                      payload: selectedLabel.id,
                    });
                    setShowLabelModal(false);
                  }}
                  className="material-icons-outlined text-gray-400 cursor-pointer"
                >
                  <Trash size={16} />
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLabelModal(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </header>
          <div className="flex p-3">
            <div className="flex flex-col w-[200px] px-2 border-e space-y-2">
              <h4>My Labels</h4>
              {!labels?.length && <EmptyCard title="No Labels Yet" />}
              {labels?.map((lbl) => {
                const bg = getLabelBgColor(lbl.color);
                return (
                  <div
                    key={lbl.id}
                    className="flex items-center capitalize gap-2"
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center cursor-pointer",
                        bg.label
                      )}
                    ></span>
                    {lbl.name}
                  </div>
                );
              })}
            </div>
            <div className="flex-1 space-y-2 ps-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAppointmentLabelUpsert)}>
                  {/* NAME */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Name</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Add Name"
                            disabled={
                              appointmentLabelInsertIsPending ||
                              appointmentLabelUpdateIsPending
                            }
                            autoComplete="labelName"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* COLOR */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select
                          name="ddlColor"
                          disabled={
                            appointmentLabelInsertIsPending ||
                            appointmentLabelUpdateIsPending
                          }
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {labelClasses.map((color, i) => (
                              <SelectItem key={i} value={color}>
                                <div className="flex gap-2">
                                  <span
                                    className={cn(
                                      "w-6 h-6 rounded-full flex items-center justify-center cursor-pointer",
                                      getLabelBgColor(color).label
                                    )}
                                  ></span>
                                  {color}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DESCRIPTION */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="description"
                            disabled={
                              appointmentLabelInsertIsPending ||
                              appointmentLabelUpdateIsPending
                            }
                            autoComplete="description"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <footer className="flex justify-end border-t p-3 mt-5">
                    <Button type="submit" variant="outlineprimary">
                      Save
                    </Button>
                  </footer>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
