import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadStatusSchema, LeadStatusSchemaType } from "@/schemas/lead";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { LeadStatus } from "@prisma/client";
import {
  userLeadStatusInsert,
  userLeadStatusUpdateById,
} from "@/actions/user/lead-status";

type LeadStatusFormProps = {
  leadStatus?: LeadStatus;
  onClose: () => void;
};

export const LeadStatusForm = ({
  leadStatus,
  onClose,
}: LeadStatusFormProps) => {
  const [loading, setLoading] = useState(false);
  const btnText = leadStatus ? "Update" : "Create";

  const form = useForm<LeadStatusSchemaType>({
    resolver: zodResolver(LeadStatusSchema),
    //@ts-ignore
    defaultValues: leadStatus || {
      status: "",
      description: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: LeadStatusSchemaType) => {
    setLoading(true);
    if (leadStatus)
      userLeadStatusUpdateById(values).then((data) => {
        if (data.success) {
          userEmitter.emit("userLeadStatusUpdated", data.success);
          toast.success("Lead Status updated!");
          onCancel();
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    else
      userLeadStatusInsert(values).then((data) => {
        if (data.success) {
          userEmitter.emit("userLeadStatusInserted", data.success);
          toast.success("New lead status created!");
          onCancel();
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
            {/* STATUS NAME */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Status Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Do Not Disturb"
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
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Description
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description"
                      disabled={loading}
                      autoComplete="Description"
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
