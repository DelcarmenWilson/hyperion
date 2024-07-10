import { useState } from "react";

import { useForm } from "react-hook-form";
import { useWorkFlow, useWorkFlowChanges } from "@/hooks/use-workflow";
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
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import {
  WorkflowEdgeSchema,
  WorkflowEdgeSchemaType,
} from "@/schemas/workflow/workflow";

import { edgeTypes } from "@/constants/react-flow/workflow";
import { useStore } from "reactflow";
import { Label } from "@/components/ui/label";

export const EdgeForm = () => {
  const { onUpdateEdge, onDeleteEdge } = useWorkFlowChanges();
  const { edge, onDrawerClose } = useWorkFlow();
  const [loading, setLoading] = useState(false);
  const nodes = useStore((s) => {
    const sourceNode = s.nodeInternals.get(edge?.source as string);
    const targetNode = s.nodeInternals.get(edge?.target as string);
    return [sourceNode, targetNode];
  });

  const form = useForm<WorkflowEdgeSchemaType>({
    resolver: zodResolver(WorkflowEdgeSchema),
    defaultValues: edge,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onDrawerClose();
  };

  const onSubmit = (values: WorkflowEdgeSchemaType) => {
    setLoading(true);
    onUpdateEdge(values).then((success) => {
      if (success) onCancel();
    });
    setLoading(false);
  };

  return (
    <div className="w-full pt-4">
      {nodes.map((node, i) => (
        <div key={node?.id} className="p-2">
          <div className="flex justify-between items-center">
            <Label>{i == 0 ? "Source" : "Target"}</Label>
            <span
              className={
                node?.type == "trigger" ? "text-emerald-500" : "text-blue-500"
              }
            >
              {node?.type}
            </span>
          </div>
          <Input value={node?.data.name} disabled />
        </div>
      ))}
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* ANIMATED */}
            <FormField
              control={form.control}
              name="animated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Animated edge</FormLabel>
                    <FormDescription>Animates the edge</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblIsTwoFactor"
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Type
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="ddlType"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {edgeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              Save
            </Button>
          </div>
        </form>
      </Form>
      <Button
        variant="destructive"
        className="w-full mt-4"
        onClick={() => {
          onDeleteEdge(edge?.id);
          onDrawerClose();
        }}
      >
        Delete Edge
      </Button>
    </div>
  );
};
