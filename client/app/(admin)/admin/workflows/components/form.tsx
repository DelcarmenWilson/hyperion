import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  TriggerDataSchema,
  TriggerSchema,
  TriggerSchemaType,
} from "@/schemas/trigger";

import { Trigger } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { triggerInsert, triggerUpdateById } from "@/actions/triggers";

type TriggerFormProps = {
  trigger?: TriggerSchemaType;
  onClose: () => void;
};

export const TriggerForm = ({ trigger, onClose }: TriggerFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const btnText = trigger ? "Update" : "Create";

  const form = useForm<TriggerSchemaType>({
    resolver: zodResolver(TriggerSchema),
    //@ts-ignore
    defaultValues: trigger || {
      name: "",
      data: TriggerDataSchema,
      type: "trigger",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["adminTriggers"],
    });
  };

  const onSubmit = async (values: TriggerSchemaType) => {
    setLoading(true);

    if (trigger) {
      const updatedTrigger = await triggerUpdateById(values);
      if (updatedTrigger.success) {
        invalidate();
        toast.success("Trigger Updated!");
        onCancel();
      } else toast.error(updatedTrigger.error);
    } else {
      const InsertedTrigger = await triggerInsert(values);
      if (InsertedTrigger.success) {
        invalidate();
        toast.success("Trigger created!");
        onCancel();
      } else toast.error(InsertedTrigger.error);
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
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New Trigger"
                      disabled={loading}
                      autoComplete="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DESCRIPTION*/}
            <FormField
              control={form.control}
              name="data.icon"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Icon
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Icon"
                      disabled={loading}
                      rows={6}
                      autoComplete="type"
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
              {btnText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
