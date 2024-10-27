"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useJobStore, useMiniJobActions } from "../../hooks/use-jobs";

import { MiniJob } from "@prisma/client";
import { MiniJobSchema, MiniJobSchemaType } from "@/schemas/job";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

export const MiniJobFormDrawer = () => {
  const { miniJobFormIsOpen, onMiniJobFormClose } = useJobStore();
  const { onMiniJobInsert, miniJobInserting } = useMiniJobActions();

  return (
    <DrawerRight
      title="New Mini Job"
      isOpen={miniJobFormIsOpen}
      onClose={onMiniJobFormClose}
    >
      <MiniJobForm
        onClose={onMiniJobFormClose}
        submit={onMiniJobInsert}
        loading={miniJobInserting}
      />
    </DrawerRight>
  );
};

type Props = {
  job?: MiniJob | null;
  submit: (e: MiniJobSchemaType) => void;
  loading: boolean;
  onClose?: () => void;
};

const MiniJobForm = ({ job, submit, loading, onClose }: Props) => {
  const form = useForm<MiniJobSchemaType>({
    resolver: zodResolver(MiniJobSchema),
    defaultValues: job || {
      comments: undefined,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) onClose();
  };

  return (
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(submit)}
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
                    placeholder="eg. Lead Page"
                    disabled={loading}
                    autoComplete="miniJobName"
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
                    disabled={loading}
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
          <Button disabled={loading} type="submit">
            {job ? "Update" : "Create"} Job
          </Button>
        </div>
      </form>
    </Form>
  );
};
