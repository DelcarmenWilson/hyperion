import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  WorkFlowSchema,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";
import { workFlowUpdateById } from "@/actions/workflow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useWorkflowActions, useWorkflowData, useWorkflowStore } from "@/app/(pages)/workflows/hooks/use-workflow";
import { Workflow } from "@prisma/client";

export const WorkflowForm = () => {
 
  const { workflowData } = useWorkflowData();
 
  const {isFormOpen,setFormClose}=useWorkflowStore()
  return (
    <Dialog open={isFormOpen} onOpenChange={setFormClose}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>desc</DialogDescription>
          <DialogTitle>title</DialogTitle>
        </DialogHeader>

     <WForm workflow={workflowData} onClose={setFormClose} />
      </DialogContent>
    </Dialog>
  );
};

type WFormProps={workflow:Workflow|null; onClose:()=>void}

const WForm = ({workflow,onClose}:WFormProps) => {
  const {onWorkflowSubmit}= useWorkflowActions()
  const [loading, setLoading] = useState(false);
  const form = useForm<WorkFlowSchemaType>({
    resolver: zodResolver(WorkFlowSchema),
    //@ts-ignore
    defaultValues: workflow,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
     onClose();
  };

  

  return (
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onWorkflowSubmit)}
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
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
