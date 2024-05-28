import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, Calendar, Check, Trash, X } from "lucide-react";
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
import {
  appointmentLabelInsert,
  appointmentLabelUpdateById,
} from "@/actions/appointment";
import { getLabelBgColor, labelClasses } from "@/formulas/labels";

export const LabelModal = () => {
  const {
    userLabels,
    setShowLabelModal,
    dispatchCalAppointment,
    selectedLabel,
  } = useAppointmentContext();

  const [loading, setLoading] = useState(false);

  const form = useForm<AppointmentLabelSchemaType>({
    resolver: zodResolver(AppointmentLabelSchema),
    //@ts-ignore
    defaultValues: selectedLabel || {
      id: "",
      name: "",
      color: labelClasses[0],
    },
  });

  const onSubmit = (values: AppointmentLabelSchemaType) => {
    setLoading(true);

    if (selectedLabel) {
      appointmentLabelUpdateById(values).then((data) => {
        if (data.success) {
          dispatchCalAppointment({
            type: "update_appointment",
            payload: data.success,
          });

          toast.success("Label Created");
          setShowLabelModal(false);
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      appointmentLabelInsert(values).then((data) => {
        if (data.success) {
          dispatchCalAppointment({
            type: "insert_appointment",
            payload: data.success,
          });

          toast.success("Label Created");
          setShowLabelModal(false);
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    }

    setLoading(false);
  };

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
              <Button onClick={() => setShowLabelModal(false)}>
                <X size={16} />
              </Button>
            </div>
          </header>
          <div className="flex p-3">
            <div className="w-[200px] px-2 border-e space-y-2">
              <h4>My Labels</h4>
              {userLabels?.map((lbl) => (
                <div key={lbl.id} className="flex gap-2">
                  <span
                    className={`${getLabelBgColor(
                      lbl.color
                    )} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                  ></span>
                  {lbl.name}
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-2 ps-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            disabled={loading}
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
                          name="ddlCarrier"
                          disabled={loading}
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
                                    className={`${getLabelBgColor(
                                      color
                                    )} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
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
                            disabled={loading}
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
