"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserSquare, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";

import {
  CreatePipelineSchema,
  CreatePipelineSchemaType,
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

const CreatePipelineDialog = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreatePipelineSchemaType>({
    resolver: zodResolver(CreatePipelineSchema),
    defaultValues: {},
  });
  const onCancel = () => {
    form.reset();
    setOpen(false);
  };
  const { onCreatePipeline, pipelineCreating } = usePipelineActions(onCancel);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add Stage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={UserSquare}
          title="Create stage"
          subTitle="Create a new stage"
        />
        <div className="p-2">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onCreatePipeline)}
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
                        disabled={pipelineCreating}
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
                        disabled={pipelineCreating}
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
                  disabled={pipelineCreating}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={pipelineCreating}>
                  {pipelineCreating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Proceed"
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

export default CreatePipelineDialog;
