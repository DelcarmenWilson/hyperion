import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useWorkflowFormActions,
  useWorkflowStore,
  useWorkflowData,
} from "@/hooks/workflow/use-workflow";

import { Workflow } from "@prisma/client";
import {
  WorkFlowSchema,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";

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

import { Textarea } from "@/components/ui/textarea";

import { CustomDialog } from "../global/custom-dialog";

import SkeletonWrapper from "../skeleton-wrapper";

export const WorkflowForm = () => {
  const { workflow, isFetchingWorkflow } = useWorkflowData();
  const { isFormOpen, onFormClose } = useWorkflowStore();

  return (
    <CustomDialog
      title={`WorkFlow Info - ${workflow?.title}`}
      description="Workflow Form"
      open={isFormOpen}
      onClose={onFormClose}
    >
      <SkeletonWrapper isLoading={isFetchingWorkflow}>
        <WForm workflow={workflow} />
      </SkeletonWrapper>
    </CustomDialog>
  );
};

type WFormProps = {
  workflow: Workflow | null | undefined;
};
const WForm = ({ workflow }: WFormProps) => {
  const { onWorkflowUpdate, workflowUpdateIsPending, onFormClose } =
    useWorkflowFormActions();

  const form = useForm<WorkFlowSchemaType>({
    resolver: zodResolver(WorkFlowSchema),
    defaultValues: workflow || {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onFormClose();
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onWorkflowUpdate)}
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
                      disabled={workflowUpdateIsPending}
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
                      disabled={workflowUpdateIsPending}
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
            <Button disabled={workflowUpdateIsPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
