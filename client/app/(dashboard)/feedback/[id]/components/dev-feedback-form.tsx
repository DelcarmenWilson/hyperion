"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/user-current-role";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import { DevFeedbackSchema, DevFeedbackSchemaType } from "@/schemas/feedback";
import { Textarea } from "@/components/ui/textarea";

import { feedbackUpdateByIdDev } from "@/actions/feedback";
import { Feedback } from "@prisma/client";

import { DefaultStatus } from "@/constants/texts";
import { formatDate } from "@/formulas/dates";

export const DevFeedbackForm = ({ feedback }: { feedback: Feedback }) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<DevFeedbackSchemaType>({
    resolver: zodResolver(DevFeedbackSchema),
    defaultValues: {
      id: feedback.id,
      status: feedback.status,
      comments: feedback.comments!,
    },
  });

  const onSubmit = async (values: DevFeedbackSchemaType) => {
    setLoading(true);

    await feedbackUpdateByIdDev(values).then((data) => {
      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
  return (
    <div>
      <h3 className="ml-1 text-sm font-semibold">Dev Comments</h3>
      <div className="flex justify-between items-center gap-2 text-sm text-muted-foreground px-2">
        <p>Created At: {formatDate(feedback.createdAt)}</p>
        <p>Updated At: {formatDate(feedback.updatedAt)}</p>
      </div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel> Status</FormLabel>
                  <Select
                    name="ddlStatus"
                    disabled={loading || role != "MASTER"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DefaultStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FEEDBACK */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="No comments yet"
                      disabled={loading || role != "MASTER"}
                      autoComplete="comments"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {role == "MASTER" && feedback?.status != "resolved" && (
            <div className="text-end mt-2">
              <Button disabled={loading} type="submit">
                Update Comments
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
