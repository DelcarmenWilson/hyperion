import { useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { states } from "@/constants/states";

import { AppointmentSchema, LeadSchema } from "@/schemas";
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

import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { appointmentInsert } from "@/actions/appointment";

type AppointmentFormValues = z.infer<typeof AppointmentSchema>;

export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();
  const { lead, onClose } = useAppointmentModal();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      date: new Date(),
      agentId: user?.id,
      leadId: lead?.id,
      comments: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    setLoading(true);

    await appointmentInsert(values).then((data) => {
      if (data.success) {
        router.refresh();
        toast.success("Appointment created!");
        onCancel();
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
  return (
    <div>
      <Separator className="my-2" />
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              <p className="text-xl text-primary text-center font-bold">
                {lead?.firstName} {lead?.lastName}
              </p>

              {/* DATE*/}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date</FormLabel>
                    {/*   <FormControl>
                       <Input
                         {...field}
                         placeholder="date"
                         disabled={loading}
                         type="datetime-local"
                         autoComplete="DatedateOfBirth"
                       />
                     </FormControl> */}

                    <Popover>
                      <FormControl>
                        <div className="relative">
                          <Input
                            value={
                              field.value
                                ? format(field.value, "MM-dd-yy")
                                : "Pick a date"
                            }
                          />
                          <PopoverTrigger asChild>
                            <CalendarIcon className="absolute h-4 w-4 opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer" />
                          </PopoverTrigger>
                        </div>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time*/}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Time"
                        disabled={loading}
                        type="time"
                        autoComplete="time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COMMENTS */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="comments"
                        disabled={loading}
                        autoComplete="comments"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="my-2" />
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
