"use client";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { useCurrentRole } from "@/hooks/user/use-current";
import { useFeedbackActions } from "@/hooks/feedback/use-feedback";

import { Feedback } from "@prisma/client";
import {
  UpdateFeedbackSchema,
  UpdateFeedbackSchemaType,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { DashboardRoutes } from "@/constants/page-routes";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = { feedback: Feedback; open: boolean; onClose: () => void };

export const FeedbackForm = ({ feedback, open, onClose }: Props) => {
  const role = useCurrentRole();
  const { onUpdateFeedback, updatingFeedback } = useFeedbackActions();

  const routes = [...DashboardRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const form = useForm<UpdateFeedbackSchemaType>({
    resolver: zodResolver(UpdateFeedbackSchema),
    //@ts-ignore
    defaultValues: feedback,
  });

  return (
    <div
      className={cn(
        "absolute flex flex-col gap-2 top-0 left-full transitio-[left] duration-500 ease-in-out w-full h-full border rounded-md bg-secondary p-2 overflow-hidden",
        open && "left-0"
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold">
          <span>Update </span>
          <span className="text-primary">Feedback</span>
        </p>
        <Button onClick={onClose} size="icon" variant="normal">
          <X size={15} />
        </Button>
      </div>
      <div className="container">
        <ScrollArea>
          <Form {...form}>
            <form
              className="space-6 px-2 w-full"
              onSubmit={form.handleSubmit(onUpdateFeedback)}
            >
              <div className="flex flex-col gap-2">
                {/* HeadLine */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel> Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Dashboard Error"
                          autoComplete="title"
                          disabled={updatingFeedback}
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
                        disabled={updatingFeedback}
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

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="flex flex-wrap justify-between items-center gap-2">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="If leaving an Error or concern, please be as specific as possible."
                          disabled={updatingFeedback}
                          autoComplete="feedback"
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {role != "MASTER" && feedback?.status != "Resolved" && (
                <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                  <Button onClick={onClose} type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button disabled={updatingFeedback} type="submit">
                    {feedback ? "Update" : "Create"} Feedback
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
