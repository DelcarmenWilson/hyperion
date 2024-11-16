"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BriefcaseIcon, Loader2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMiniJobActions } from "@/hooks/job/use-mini-job";
import { useJobId } from "@/hooks/job/use-job";

import { CreateMiniJobSchema, CreateMiniJobSchemaType } from "@/schemas/job";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { DashboardRoutes } from "@/constants/page-routes";

const CreateMiniJobDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = useState(false);
  const routes = [...DashboardRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const { jobId } = useJobId();
  const { onCreateMiniJob, creatingMiniJob } = useMiniJobActions(() =>
    setOpen(false)
  );

  const form = useForm<CreateMiniJobSchemaType>({
    resolver: zodResolver(CreateMiniJobSchema),
    defaultValues: {
      jobId,
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus size={15} />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={BriefcaseIcon} title="Create mini job" />
        <div className="px-6 py-4">
          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(onCreateMiniJob)}
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
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* CATEGORY */}

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Category
                      <p className="text-xs text-primary">(required)</p>
                      <div className="ml-auto">
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <Select
                      name="ddlCatergory"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[250px]">
                        {routes.map((route) => (
                          <SelectItem key={route.title} value={route.title}>
                            {route.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a category for this job
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
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={creatingMiniJob}
              >
                {creatingMiniJob && <Loader2 className="animate-spin" />}
                Proceed
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMiniJobDialog;
