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

import { Carrier } from "@prisma/client";
import { userCarrierInsert } from "@/actions/user";
import { Textarea } from "@/components/ui/textarea";
import { FullUserCarrier } from "@/types";

type CarrierFormProps = {
  carriers: Carrier[];
  onClose?: (e?: FullUserCarrier) => void;
};

type CarrierFormValues = z.infer<typeof UserCarrierSchema>;

export const CarrierForm = ({ carriers, onClose }: CarrierFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(UserCarrierSchema),
    defaultValues: {
      agentId: "",
      carrierId: carriers[0].id,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: CarrierFormValues) => {
    setLoading(true);
    userCarrierInsert(values).then((data) => {
      if (data.success) {
        form.reset();
        if (onClose) onClose(data.success);
        toast.success("Carrier created!");
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* CARRIER */}
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Carrier
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlCarriers"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="carriers"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Carrier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem key={carrier.id} value={carrier.id}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* AGENTID */}
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Agent Id
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="FE15745"
                      disabled={loading}
                      autoComplete="agentId"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* COMMENTS*/}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Number
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="comments"
                      disabled={loading}
                      rows={5}
                      autoComplete="comments"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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
