"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserTodo } from "@prisma/client";
import { UserTodoSchema, UserTodoSchemaType } from "@/schemas/user";

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
import { Switch } from "@/components/ui/switch";

type Props = {
  todo?: UserTodo | null;
  onSubmit: (e: UserTodoSchemaType) => void;
  loading: boolean;
  onClose?: () => void;
};
export const TodoForm = ({ todo, onSubmit, loading, onClose }: Props) => {
  const form = useForm<UserTodoSchemaType>({
    resolver: zodResolver(UserTodoSchema),
    //@ts-ignore
    defaultValues: todo || {
      reminder: false,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) onClose();
  };

  return (
    <div className="h-full overflow-y-auto">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Title
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="flex-1"
                    placeholder="eg. Sample Todo"
                    disabled={loading}
                    autoComplete="todo-title"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Description
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="eg. Call old leads"
                    disabled={loading}
                    autoComplete="description"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* COMMENTS */}
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Comments
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="eg. test"
                    disabled={loading}
                    autoComplete="comments"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* REMINDER */}
          <FormField
            control={form.control}
            name="reminder"
            render={({ field }) => (
              <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                <div className="flex flex-col space-y-0.5">
                  <FormLabel>Reminder</FormLabel>

                  <span className="text-[0.8rem] text-muted-foreground">
                    Reminder
                  </span>
                </div>

                <FormControl>
                  <Switch
                    disabled={loading}
                    name="cblReminder"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {todo ? "Update" : "Create"} Todo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
