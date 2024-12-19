"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BriefcaseIcon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdateJobSchema, UpdateJobSchemaType } from "@/schemas/job";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Job } from "@prisma/client";
import CustomDialogHeader from "@/components/custom-dialog-header";
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

import { useJobActions } from "@/hooks/job/use-job";

const UpdateJobDialog = ({ job }: { job: Job }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateJobSchemaType>({
    resolver: zodResolver(UpdateJobSchema),
    //@ts-ignore
    defaultValues: job,
  });
  const onCancel = () => {
    form.reset();
    setOpen(false);
  };
  const { onJobUpdate, jobUpdating } = useJobActions(onCancel);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outlineprimary" size="xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={BriefcaseIcon} title="Update job" />
        <div className="px-4 py-2">
          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(onJobUpdate)}
            >
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
                      <Input {...field} autoComplete="job-name" />
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
                      Provide a brief description of what your job is for. This
                      is optional but can help you remember the job&apos;s
                      purpose.
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
                      Leave some comments for the team
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={jobUpdating}>
                {jobUpdating ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobDialog;
