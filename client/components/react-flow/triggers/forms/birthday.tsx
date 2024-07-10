import { useState } from "react";
import {
  useWorkFlowChanges,
  useWorkFlowDefaultData,
} from "@/hooks/use-workflow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  WorkflowBirthdayTriggerSchema,
  WorkflowBirthdayTriggerSchemaType,
} from "@/schemas/workflow/trigger";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import {
  TRIGGER_CATEGORIES_SELECT,
  TRIGGER_ICONS_SELECT,
} from "@/constants/react-flow/workflow";

type BirthdayFormProps = {
  node: WorkflowBirthdayTriggerSchemaType;
  onClose: () => void;
};

export const BirthdayForm = ({ node, onClose }: BirthdayFormProps) => {
  const { onNodeUpdate } = useWorkFlowChanges(onClose);
  const [loading, setLoading] = useState(false);

  const form = useForm<WorkflowBirthdayTriggerSchemaType>({
    resolver: zodResolver(WorkflowBirthdayTriggerSchema),
    defaultValues: node,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = (values: WorkflowBirthdayTriggerSchemaType) => {
    setLoading(true);
    onNodeUpdate(values);
    setLoading(false);
  };
  return (
    <div className="w-full mt-2">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* TEXT */}
          <FormField
            control={form.control}
            name="data.text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Text
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Trigger Description"
                    disabled={loading}
                    autoComplete="Text"
                    rows={5}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* TRIGGER NAME */}
          <FormField
            control={form.control}
            name="data.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Trigger Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Default Name"
                    disabled={loading}
                    autoComplete="Trigger Name"
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
    </div>
  );
};
