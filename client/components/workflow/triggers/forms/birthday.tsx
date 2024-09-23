import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditorChanges } from "@/hooks/workflow/use-editor";

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
import {
  WorkflowNodeSchema,
  WorkflowNodeSchemaType,
} from "@/schemas/workflow/workflow";

type BirthdayFormProps = {
  node: WorkflowNodeSchemaType;
  onClose: () => void;
};

export const BirthdayForm = ({ node, onClose }: BirthdayFormProps) => {
  const { onNodeUpdate, nodeUpdateIsPending } = useEditorChanges();

  const form = useForm<WorkflowNodeSchemaType>({
    resolver: zodResolver(WorkflowNodeSchema),
    defaultValues: node,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div className="w-full mt-2">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onNodeUpdate)}
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
                    disabled={nodeUpdateIsPending}
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
                    disabled={nodeUpdateIsPending}
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
            <Button disabled={nodeUpdateIsPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
