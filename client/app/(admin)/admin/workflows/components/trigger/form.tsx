import { useState } from "react";
import { useWorkFlowDefaultData } from "@/hooks/workflow/use-workflow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  WorkflowTriggerDataSchemaType,
  WorkflowTriggerSchema,
  WorkflowTriggerSchemaType,
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

type TriggerFormProps = {
  trigger?: WorkflowTriggerSchemaType;
  onClose: () => void;
};

export const TriggerForm = ({ trigger, onClose }: TriggerFormProps) => {
  const { onInsertWorkflowDefaultNode, onUpdateWorkflowDefaultNode } =
    useWorkFlowDefaultData(onClose);
  const [loading, setLoading] = useState(false);
  const btnText = trigger ? "Update" : "Create";
  const data: WorkflowTriggerDataSchemaType = {
    icon: "",
    name: "",
    text: "",
  };

  const form = useForm<WorkflowTriggerSchemaType>({
    resolver: zodResolver(WorkflowTriggerSchema),
    defaultValues: trigger || {
      id: undefined,
      name: undefined,
      data,
      type: "trigger",
      category: "contact",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = (values: WorkflowTriggerSchemaType) => {
    setLoading(true);

    if (trigger) {
      onUpdateWorkflowDefaultNode(values);
    } else {
      onInsertWorkflowDefaultNode(values);
    }
    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Category
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="ddlCategory"
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
                        {TRIGGER_CATEGORIES_SELECT.map((category) => (
                          <SelectItem key={category} value={category}>
                            <span className="capitalize">{category}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New Trigger"
                      disabled={loading}
                      autoComplete="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <h4>Data</h4>
            <div className="space-y-2 border p-1">
              {/* ICON*/}
              <FormField
                control={form.control}
                name="data.icon"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="flex justify-between items-center">
                      Icon
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Select
                        name="ddlIcon"
                        disabled={loading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRIGGER_ICONS_SELECT.map((icon) => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <icon.Icon className="text-primary" />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {btnText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
