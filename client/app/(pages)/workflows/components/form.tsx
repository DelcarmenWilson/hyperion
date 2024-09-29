import { useState } from "react";
import { useWorkflowActions } from "@/hooks/workflow/use-workflow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Workflow } from "@prisma/client";
import {
  WorkFlowSchema,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { DrawerRight } from "@/components/custom/drawer-right";

type WorkflowFormProps = {
  workflow?: Workflow;
  open: boolean;
  onClose: () => void;
};

export const WorkflowForm = ({
  workflow,
  open,
  onClose,
}: WorkflowFormProps) => {
  const {
    onWorkflowInsert,
    workflowInsertIsPending,
    onWorkflowUpdate,
    workflowUpdateIsPending,
  } = useWorkflowActions();
  const title = workflow ? "Update Workflow" : "New Workflow";
  return (
    <DrawerRight title={title} isOpen={open} onClose={onClose}>
      <WForm
        workflow={workflow}
        onSubmit={workflow ? onWorkflowUpdate : onWorkflowInsert}
        loading={workflow ? workflowUpdateIsPending : workflowInsertIsPending}
        onClose={onClose}
      />
    </DrawerRight>
  );
};

type WFormProps = {
  workflow?: Workflow;
  loading: boolean;
  onSubmit: (e: WorkFlowSchemaType) => void;
  onClose: () => void;
};
const WForm = ({ workflow, loading, onSubmit, onClose }: WFormProps) => {
  const btnText = workflow ? "Update" : "Create";

  const form = useForm<WorkFlowSchemaType>({
    resolver: zodResolver(WorkFlowSchema),
    //@ts-ignore
    defaultValues: workflow || {
      title: "",
      description: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* TYPE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Title
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New Work Flow"
                      disabled={loading}
                      autoComplete="Title"
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
                      placeholder="Work Flow Description"
                      disabled={loading}
                      rows={6}
                      autoComplete="description"
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
