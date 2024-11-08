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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/formulas/dates";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import ReactDatePicker from "react-datepicker";

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
      startAt: undefined,
      endAt: undefined,
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

          <div className="grid grid-cols-2 gap-2">
            {/* START AT  */}
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Start Date</FormLabel>
                  <Popover>
                    <FormControl>
                      <div className="relative">
                        <Input
                          value={
                            field.value
                              ? formatDate(field.value)
                              : "Pick a date"
                          }
                        />
                        <PopoverTrigger asChild>
                          <CalendarIcon
                            size={16}
                            className="absolute opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer"
                          />
                        </PopoverTrigger>
                      </div>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* START AT */}
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Start Date</FormLabel>

                  <FormControl>
                    <Input type="time" autoComplete="time" step="300" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* END AT */}
          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel> End Date</FormLabel>
                <Popover>
                  <FormControl>
                    <div className="relative">
                      <Input
                        value={
                          field.value ? formatDate(field.value) : "Pick a date"
                        }
                      />
                      <PopoverTrigger asChild>
                        <CalendarIcon
                          size={16}
                          className="absolute opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer"
                        />
                      </PopoverTrigger>
                    </div>
                  </FormControl>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
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
