import { useState } from "react";
import { useWorkFlowData } from "@/hooks/use-workflow";
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

type WorkflowFormProps = {
  workflow?: Workflow;
  onClose: () => void;
};

export const WorkflowForm = ({ workflow, onClose }: WorkflowFormProps) => {
  const { onInsertWorkflow, onUpdateWorkflow } = useWorkFlowData();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (values: WorkFlowSchemaType) => {
    setLoading(true);
    if (workflow) {
      const updatedWorkFlow = await onUpdateWorkflow(values);
      if (updatedWorkFlow) onCancel();
    } else {
      const insertedWorkFlow = await onInsertWorkflow(values);
      if (insertedWorkFlow) onCancel();
    }
    setLoading(false);
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
