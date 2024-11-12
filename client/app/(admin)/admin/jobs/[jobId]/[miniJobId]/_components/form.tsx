"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMiniJobActions } from "@/hooks/job/use-mini-job";

import { MiniJob } from "@prisma/client";
import { UpdateMiniJobSchema, UpdateMiniJobSchemaType } from "@/schemas/job";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = { miniJob: MiniJob; open: boolean; onClose: () => void };
const MiniJobForm = ({ miniJob, open, onClose }: Props) => {
  const { onUpdateMiniJob, updatingMiniJob } = useMiniJobActions(onClose);

  const form = useForm<UpdateMiniJobSchemaType>({
    resolver: zodResolver(UpdateMiniJobSchema),
    //@ts-ignore
    defaultValues: miniJob,
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
          <span className="text-primary">Mini Job</span>
        </p>
        <Button onClick={onClose} size="icon" variant="normal">
          <X size={15} />
        </Button>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-6 py-4 w-full h-full overflow-hidden"
          onSubmit={form.handleSubmit(onUpdateMiniJob)}
        >
          <ScrollArea>
            <div className="space-y-4 px-1">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                      <div className="ml-auto">
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                      <div className="ml-auto">
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief descripotion of what your mini job is for
                      does.
                      <br /> This is optional but can help you remeber the
                      job&apos;s purpose.
                    </FormDescription>
                  </FormItem>
                )}
              />
              {/* COMMENTS */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Comments
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                      <div className="ml-auto">
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your mini job is for
                      does.
                      <br /> Leave comments behind for the team.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          <div className="mt-auto">
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={updatingMiniJob}
            >
              {updatingMiniJob && <Loader2 className="animate-spin" />}
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MiniJobForm;
