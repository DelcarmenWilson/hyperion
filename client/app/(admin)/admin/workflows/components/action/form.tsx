import { useState } from "react";
import { useWorkFlowDefaultData } from "@/hooks/use-workflow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  WorkflowActionDataSchemaType,
  WorkflowActionSchema,
  WorkflowActionSchemaType,
} from "@/schemas/workflow/action";

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
//TODO - need to change this to react off the actions ts
import {
  TRIGGER_CATEGORIES_SELECT,
  TRIGGER_ICONS_SELECT,
} from "@/constants/react-flow/workflow";

type ActionFormProps = {
  action?: WorkflowActionSchemaType;
  onClose: () => void;
};

export const ActionForm = ({ action, onClose }: ActionFormProps) => {
  const { onInsertWorkflowDefaultNode, onUpdateWorkflowDefaultNode } =
    useWorkFlowDefaultData();
  const [loading, setLoading] = useState(false);
  const btnText = action ? "Update" : "Create";
  const data: WorkflowActionDataSchemaType = {
    icon: "",
    name: "",
    text: "",
  };

  const form = useForm<WorkflowActionSchemaType>({
    resolver: zodResolver(WorkflowActionSchema),
    defaultValues: action || {
      id: undefined,
      name: undefined,
      data,
      type: "action",
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

  const onSubmit = async (values: WorkflowActionSchemaType) => {
    setLoading(true);

    if (action) {
      const updatedAction = await onUpdateWorkflowDefaultNode(values);
      if (updatedAction) onCancel();
    } else {
      const insertedAction = await onInsertWorkflowDefaultNode(values);
      if (insertedAction) onCancel();
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
                      placeholder="New Action"
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
                        name="ddlGender"
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
                        placeholder="Action Description"
                        disabled={loading}
                        autoComplete="Text"
                        rows={5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ACTION NAME */}
              <FormField
                control={form.control}
                name="data.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      Action Name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Default Name"
                        disabled={loading}
                        autoComplete="Action Name"
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
