"use client";
import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

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

import { UserCarrierSchema, UserCarrierSchemaType } from "@/schemas/user";

import { userCarrierInsert, userCarrierUpdateById } from "@/actions/user";
import { Textarea } from "@/components/ui/textarea";
import { FullUserCarrier } from "@/types";
import { useGlobalContext } from "@/providers/global";

type CarrierFormProps = {
  carrier?: FullUserCarrier;
  onClose: () => void;
};

export const CarrierForm = ({ carrier, onClose }: CarrierFormProps) => {
  const { availableCarriers } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserCarrierSchemaType>({
    resolver: zodResolver(UserCarrierSchema),
    //@ts-ignore
    defaultValues: carrier || {
      agentId: "",
      carrierId: availableCarriers ? availableCarriers[0].id : "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: UserCarrierSchemaType) => {
    setLoading(true);
    if (carrier) {
      const updatedCarrier = await userCarrierUpdateById(values);

      if (updatedCarrier.success) {
        userEmitter.emit("carrierUpdated", updatedCarrier.success);
        toast.success("Carrier updated!");
        onClose();
      } else toast.error(updatedCarrier.error);
    } else {
      const insertedCarrier = await userCarrierInsert(values);
      if (insertedCarrier.success) {
        userEmitter.emit("carrierInserted", insertedCarrier.success);
        toast.success("Carrier created!");
        onClose();
      } else toast.error(insertedCarrier.error);
    }
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
                      {availableCarriers?.map((carrier) => (
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
                    Comments
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
