"use client";
import * as z from "zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { UserCarrierSchema } from "@/schemas";

import { Appointment, Carrier } from "@prisma/client";
import { userCarrierInsert } from "@/actions/user";
import { Textarea } from "@/components/ui/textarea";
import { FullAppointment, FullUserCarrier } from "@/types";

type AppointmentFormProps = {
  appointment: FullAppointment;
  onClose: () => void;
};

type AppointmentFormValues = z.infer<typeof UserCarrierSchema>;

export const AppointmentForm = ({
  appointment,
  onClose,
}: AppointmentFormProps) => {
  const [loading, setLoading] = useState(false);

  // const form = useForm<CarrierFormValues>({
  //   resolver: zodResolver(UserCarrierSchema),
  //   defaultValues: {
  //     agentId: "",
  //     carrierId: carriers[0].id,
  //   },
  // });

  // const onCancel = () => {
  //   form.clearErrors();
  //   form.reset();
  //   if (onClose) {
  //     onClose();
  //   }
  // };

  // const onSubmit = async (values: AppointmentFormProps) => {
  //   setLoading(true);
  //   userCarrierInsert(values).then((data) => {
  //     if (data.success) {
  //       form.reset();
  //       if (onClose) onClose(data.success);
  //       toast.success("Carrier created!");
  //     }
  //     if (data.error) {
  //       toast.error(data.error);
  //     }
  //   });
  //   setLoading(false);
  // };
  return <div>APOOINTMENT FORM</div>;
};
