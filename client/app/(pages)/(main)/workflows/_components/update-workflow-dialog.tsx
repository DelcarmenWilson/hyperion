"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Layers2Icon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkflowActions } from "@/hooks/use-workflow";

import { Workflow } from "@prisma/client";
import {
  updateWorkflowSchema,
  updateWorkflowSchemaType,
} from "@/schemas/workflow";

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
import { Textarea } from "@/components/ui/textarea";

const UpdateWorkflowDialog = ({ workflow }: { workflow: Workflow }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<updateWorkflowSchemaType>({
    resolver: zodResolver(updateWorkflowSchema),
    defaultValues: workflow as updateWorkflowSchemaType,
  });
  const onCancel = () => {
    form.reset();
    setOpen(false);
  };
  const { onUpdateWorkflow, workflowUpdating } = useWorkflowActions(onCancel);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outlineprimary" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create workflow"
          subTitle="Start building your workflow"
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onUpdateWorkflow)}
            >
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a decriptive and unique name
                    </FormDescription>
                    <FormMessage />
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
                      Description{" "}
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief descripotion of what your workflow does.
                      <br /> This is optional but can help you remeber the
                      workflow&apos;s purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={workflowUpdating}
              >
                {workflowUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkflowDialog;
