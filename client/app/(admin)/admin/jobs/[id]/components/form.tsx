"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Job } from "@prisma/client";
import { JobSchema, JobSchemaType } from "@/schemas/job";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
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
import { useJobActions } from "../../hooks/use-jobs";

export const JobForm = ({ job }: { job: Job }) => {
  const { onJobUpdate, jobUpdateIsPending } = useJobActions();

  const routes = [...DashboardRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const form = useForm<JobSchemaType>({
    resolver: zodResolver(JobSchema),
    defaultValues: job,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };
  return (
    <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
      <div className="border-e">
        <Form {...form}>
          <form
            className="space-6 px-2 w-full"
            onSubmit={form.handleSubmit(onJobUpdate)}
          >
            <div className="flex flex-col gap-2">
              {/* HEADLINE */}
              <FormField
                control={form.control}
                name="headLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      Headline
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Lead Page"
                        disabled={jobUpdateIsPending}
                        autoComplete="HeadLine"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* CATERGORY */}

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel> Category</FormLabel>
                    <Select
                      name="ddlCatergory"
                      disabled={jobUpdateIsPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
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
                        disabled={jobUpdateIsPending}
                        autoComplete="Description"
                        rows={4}
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
                        disabled={jobUpdateIsPending}
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
              <Button disabled={jobUpdateIsPending} type="submit">
                Update Job
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
