"use client";
import { ArrowRight, List } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoActions, useTodoStore } from "@/hooks/user/use-todo";

import { UserTodo } from "@prisma/client";
import { TodoSchema, TodoSchemaType } from "@/schemas/user";
import { TodoReminderMethod } from "@/types/todo";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/custom/time-picker";

import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getYesterday } from "@/formulas/dates";
import { getEnumValues } from "@/lib/helper/enum-converter";
import CategoryPicker from "./category-picker";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TodoForm = () => {
  const { todo, isTodoFormOpen, onTodoFormClose } = useTodoStore();
  const { onTodoInsert, todoInserting, onTodoUpdate, todoUpdating } =
    useTodoActions();
  if (!isTodoFormOpen) return null;
  return (
    <div className="flex gap-2 flex-col w-[500px] h-full p-4">
      <div className="flex gap-2 items-center border-b p-2">
        <div className="shrink-0">
          <List size={16} />
        </div>

        <p className="text-center text-sm font-semibold text-nowrap overflow-hidden text-ellipsis capitalize">
          {todo ? todo.title : "New Todo"}
        </p>

        <Button size="sm" className="ml-auto" onClick={onTodoFormClose}>
          <span className="sr-only">Close panel</span>
          <ArrowRight size={16} />
        </Button>
      </div>
      <TodoFrm
        key={todo?.id || "new-todo"}
        todo={todo}
        onSubmit={todo ? onTodoUpdate : onTodoInsert}
        loading={todo ? todoUpdating : todoInserting}
        onClose={onTodoFormClose}
      />
    </div>
  );
};

type Props = {
  todo?: UserTodo | null;
  onSubmit: (e: TodoSchemaType) => void;
  loading: boolean;
  onClose?: () => void;
};
const TodoFrm = ({ todo, onSubmit, loading, onClose }: Props) => {
  const todoReminderMethods = getEnumValues(TodoReminderMethod);
  const form = useForm<TodoSchemaType>({
    resolver: zodResolver(TodoSchema),
    //@ts-ignore
    defaultValues: todo || {
      categoryId: "cm448mzwq0000ujp4ok281xfg",
      reminder: false,
      reminderMethod: TodoReminderMethod.Notification,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) onClose();
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-2 h-full w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ScrollArea className="flex-1 h-full">
            <div className=" px-1 space-y-2">
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

              {/* CATEGORYID */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
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

                      <FormDescription>Send reminder </FormDescription>
                    </div>

                    <FormControl>
                      <Switch
                        disabled={loading}
                        name="cblReminder"
                        checked={field.value}
                        onCheckedChange={(e) => {
                          form.setValue("startAt", undefined);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div
                className={cn(
                  "flex-col space-y-2 hidden transition-all duration-100 ease-in-out",
                  form.watch("reminder") && "flex"
                )}
              >
                <p className="text-primary text-center font-bold">
                  Reminder Settings
                </p>
                {/* START AT */}
                <FormField
                  control={form.control}
                  name="startAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-left">
                        Reminder Date Time
                      </FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP hh:mm aa")
                              ) : (
                                <span>Pick a date and time </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <= getYesterday() ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                {/* REMINDER TYPE */}
                <FormField
                  control={form.control}
                  name="reminderMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Method
                        <FormMessage />
                      </FormLabel>
                      <Select
                        name="ddlReminderMethod"
                        disabled={loading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Method" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {todoReminderMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* END AT */}
                <FormField
                  control={form.control}
                  name="endAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-left">End Date</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP hh:mm aa")
                              ) : (
                                <span>Pick a date and time </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <= getYesterday() ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </ScrollArea>
          <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between">
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
