"use client";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { FeedbackSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MainSidebarRoutes } from "@/constants/page-routes";
import { feedbackInsert, feedbackUpdateById } from "@/actions/feedback";
import { Feedback } from "@prisma/client";
import { useCurrentRole } from "@/hooks/user-current-role";

type FeedbackFormValues = z.infer<typeof FeedbackSchema>;
type FeedbackFormProps = {
  feedback: Feedback | null;
};

export const FeedbackForm = ({ feedback }: FeedbackFormProps) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const routes = [...MainSidebarRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: feedback || {
      headLine: "",
      page: "Dashboard",
      feedback: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    setLoading(true);

    if (feedback) {
      await feedbackUpdateById(values).then((data) => {
        if (data.success) {
          router.refresh();
          toast.success(data.success);
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      await feedbackInsert(values).then((data) => {
        if (data.success) {
          router.refresh();
          toast.success(data.success);
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
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          {/* HeadLine */}
          <FormField
            control={form.control}
            name="headLine"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel> Head Line</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Dashboard Error"
                    autoComplete="HeadLine"
                    disabled={loading || role == "MASTER"}
                    type="text"
                    maxLength={40}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PAGE */}
          <FormField
            control={form.control}
            name="page"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel> Page</FormLabel>
                <Select
                  name="ddlPage"
                  disabled={loading || role == "MASTER"}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.title} value={route.title}>
                        {route.title}
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
            name="feedback"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="If leaving an Error or concern, please be as specific as possible."
                    disabled={loading || role == "MASTER"}
                    autoComplete="feedback"
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {role != "MASTER" && feedback?.status != "resolved" && (
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {feedback ? "Update" : "Create"} Feedback
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
