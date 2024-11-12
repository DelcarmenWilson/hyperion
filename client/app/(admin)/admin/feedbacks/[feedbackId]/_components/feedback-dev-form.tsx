"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFeedbackActions } from "@/hooks/feedback/use-feedback";

import { FeedbackStatus } from "@/types/feedback";
import {
  UpdateDevFeedbackSchema,
  UpdateDevFeedbackSchemaType,
} from "@/schemas/feedback";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Feedback } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { formatDate } from "@/formulas/dates";
import { getEnumValues } from "@/lib/helper/enum-converter";

const FeedbackFormDev = ({ feedback }: { feedback: Feedback }) => {
  const feedbackStatuses = getEnumValues(FeedbackStatus);
  const isCompleted = feedback.status == FeedbackStatus.COMPLETED;
  const { onUpdateFeedbackDev, updatingFeedbackDev } = useFeedbackActions();
  const form = useForm<UpdateDevFeedbackSchemaType>({
    resolver: zodResolver(UpdateDevFeedbackSchema),
    defaultValues: {
      id: feedback.id,
      status: feedback.status,
      comments: feedback.comments!,
    },
  });

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
          onSubmit={form.handleSubmit(onUpdateFeedbackDev)}
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
                    disabled={updatingFeedbackDev}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feedbackStatuses.map((status) => (
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
                      disabled={updatingFeedbackDev}
                      autoComplete="comments"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-end mt-2">
            <Button disabled={updatingFeedbackDev || isCompleted} type="submit">
              Update Comments
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackFormDev;
