"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserSquare, Loader2, FilePenLine } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";

import { Pipeline } from "@prisma/client";
import {
  UpdatePipelineSchema,
  UpdatePipelineSchemaType,
} from "@/schemas/pipeline";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { StatusSelect } from "@/components/global/selects/lead-status";

const UpdatePipelineDialog = ({ pipeline }: { pipeline: Pipeline }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdatePipelineSchemaType>({
    resolver: zodResolver(UpdatePipelineSchema),
    defaultValues: pipeline,
  });
  const onCancel = () => {
    form.reset();
    setOpen(false);
  };
  const { onUpdatePipeline, pipelineUpdating } = usePipelineActions(onCancel);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 w-full justify-start" variant="ghost">
          <FilePenLine size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={UserSquare} title="Update stage" />
        <div className="p-2">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onUpdatePipeline)}
            >
              {/* STATUS */}
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Status <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <StatusSelect
                        disabled={pipelineUpdating}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a status or create a new one
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1"
                        placeholder="e.g. New Leads"
                        disabled={pipelineUpdating}
                        autoComplete="title"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a name to descibe your pipeline.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outlineprimary"
                  type="button"
                  disabled={pipelineUpdating}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={pipelineUpdating}>
                  {pipelineUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePipelineDialog;
