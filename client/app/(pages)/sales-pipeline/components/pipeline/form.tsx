"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";
import {
  usePipelineActions,
  usePipelineData,
} from "@/hooks/pipeline/use-pipeline";

import { Pipeline } from "@prisma/client";
import { PipelineSchema, PipelineSchemaType } from "@/schemas/pipeline";

import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { StatusSelect } from "@/components/global/selects/lead-status";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const PipelineForm = () => {
  const { isFormOpen, onFormClose, type } = usePipelineStore();
  const { pipeline, isFetchingPipeline } = usePipelineData();
  const {
    isPendingPipelineInsert,
    onPipelineInsertSubmit,
    onPipelineUpdateSubmit,
    isPendingPipelineUpdate,
  } = usePipelineActions();

  return (
    <CustomDialog
      open={isFormOpen}
      onClose={onFormClose}
      title={`${type == "edit" ? "Edit" : "Add"} Stage`}
      description="Pipeline Form"
    >
      <SkeletonWrapper isLoading={isFetchingPipeline}>
        <PipForm
          pipeline={pipeline || null}
          loading={
            type == "edit" ? isPendingPipelineUpdate : isPendingPipelineInsert
          }
          type={type}
          onSubmit={
            type == "edit" ? onPipelineUpdateSubmit : onPipelineInsertSubmit
          }
          onClose={onFormClose}
        />
      </SkeletonWrapper>
    </CustomDialog>
  );
};

type Props = {
  pipeline: Pipeline | null;
  loading: boolean;
  type: "edit" | "insert";
  onSubmit: (values: PipelineSchemaType) => void;
  onClose: () => void;
};
const PipForm = ({ pipeline, loading, type, onSubmit, onClose }: Props) => {
  const form = useForm<PipelineSchemaType>({
    resolver: zodResolver(PipelineSchema),
    defaultValues: pipeline || {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div className="h-full overflow-y-auto">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* STATUS */}
          <FormField
            control={form.control}
            name="statusId"
            render={({ field }) => (
              <FormItem className=" col-span-2">
                <FormLabel className="flex justify-between">
                  Status
                  <FormMessage />
                </FormLabel>

                <StatusSelect
                  disabled={type == "edit" ? true : loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormItem>
            )}
          />

          {/* TITLE */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Title
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="flex-1"
                    placeholder="e.g. New Leads"
                    disabled={loading}
                    autoComplete="title"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-x-2 justify-between mt-auto">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
