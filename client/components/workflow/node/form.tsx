import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEditorChanges, useEditorStore } from "@/hooks/workflow/use-editor";

import {
  WorkflowNodeSchema,
  WorkflowNodeSchemaType,
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

export const NodeForm = () => {
  const { selectedNode } = useEditorStore();
  const { onNodeDelete } = useEditorChanges();

  return (
    <div className="flex flex-col w-full h-full pt-4">
      <NForm node={selectedNode as WorkflowNodeSchemaType} />
      <Button
        variant="destructive"
        className="w-full mt-auto"
        onClick={() => onNodeDelete(selectedNode?.id!, selectedNode?.type!)}
      >
        Delete Node
      </Button>
    </div>
  );
};
type NFormProps = {
  node: WorkflowNodeSchemaType;
};
const NForm = ({ node }: NFormProps) => {
  const { onDrawerClose } = useEditorStore();
  const { onNodeUpdate, nodeUpdateIsPending } = useEditorChanges();

  const form = useForm<WorkflowNodeSchemaType>({
    resolver: zodResolver(WorkflowNodeSchema),
    defaultValues: node,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onDrawerClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex-1 space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onNodeUpdate)}
      >
        <div className="flex flex-col gap-2">
          {/* TYPE */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Type
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg border p-3 shadow-sm mt-3">
            {/* POSITION X */}
            <FormField
              control={form.control}
              name="position.x"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postion X</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={nodeUpdateIsPending}
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* POSITION X */}
            <FormField
              control={form.control}
              name="position.y"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postion Y</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={nodeUpdateIsPending}
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* ICON */}
          <FormField
            control={form.control}
            name="data.icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Icon
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* NAME */}
          <FormField
            control={form.control}
            name="data.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

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
                  <Textarea {...field} rows={5} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={nodeUpdateIsPending} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
