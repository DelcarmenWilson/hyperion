"use client";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/user-current-role";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { TaskSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageModal } from "@/components/modals/image";
import { ImageGrid } from "@/components/reusable/image-grid";
import { Task } from "@prisma/client";
import { DefaultStatus } from "@/constants/texts";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { taskUpdateById } from "@/actions/task";

type TaskFormValues = z.infer<typeof TaskSchema>;
type TaskFormProps = {
  task: Task;
};

export const TaskIdForm = ({ task }: TaskFormProps) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>(
    task?.images ? task.images.split(",") : []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const isMaster = role != "MASTER" && task?.status != "Resolved";

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: task,
  });

  const onImagesAdded = (e: string[], files: File[]) => {
    setImages((imgs) => [...imgs, ...e]);
    setFiles((fls) => [...fls, ...files]);
    setModalOpen(false);
  };

  const onImageRemove = (e: number) => {
    if (e < 0) return;
    const newImages = images;
    newImages.splice(e, 1);
    setImages(newImages);
    setFiles((files) => {
      files.splice(e, 1);
      return files;
    });
  };

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: TaskFormValues) => {
    setLoading(true);
    taskUpdateById(values).then((data) => {
      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
  return (
    <>
      <ImageModal
        title="Upload Task Images?"
        description=""
        id={task?.id}
        type="task"
        filePath="assets/tasks"
        multi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImagesAdded}
      />
      <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <Form {...form}>
            <form
              className="space-6 px-2 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-2">
                {/* STATUS */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel> Status</FormLabel>
                      <Select
                        name="ddlStatus"
                        disabled={loading || role != "ADMIN"}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DefaultStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* HeadLine */}
                <FormField
                  control={form.control}
                  name="headLine"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel> Head Line</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Dashboard Error"
                          autoComplete="HeadLine"
                          disabled={loading || role == "MASTER"}
                          type="text"
                          maxLength={40}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="flex flex-wrap justify-between items-center gap-2">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="If leaving an Error or concern, please be as specific as possible."
                          disabled={loading || role == "MASTER"}
                          autoComplete="description"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-x-2 items-center">
                  {/* START AT */}
                  <FormField
                    control={form.control}
                    name="startAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2">
                        <FormLabel className="flex justify-between items-center">
                          Start Date
                          <FormMessage />
                        </FormLabel>
                        <Popover>
                          <FormControl>
                            <div className="relative">
                              <Input
                                value={
                                  field.value
                                    ? format(field.value, "MM-dd-yy")
                                    : "Pick a date"
                                }
                              />
                              <PopoverTrigger asChild>
                                <CalendarIcon className="absolute h-4 w-4 opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer" />
                              </PopoverTrigger>
                            </div>
                          </FormControl>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  {/* END AT */}
                  <FormField
                    control={form.control}
                    name="endAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2">
                        <FormLabel className="flex justify-between items-center">
                          End Date
                          <FormMessage />
                        </FormLabel>
                        <Popover>
                          <FormControl>
                            <div className="relative">
                              <Input
                                value={
                                  field.value
                                    ? format(field.value, "MM-dd-yy")
                                    : "Pick a date"
                                }
                              />
                              <PopoverTrigger asChild>
                                <CalendarIcon className="absolute h-4 w-4 opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer" />
                              </PopoverTrigger>
                            </div>
                          </FormControl>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>

                {/* COMMENTS*/}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel className="flex justify-between items-center">
                        Comments
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="comments"
                          disabled={loading}
                          autoComplete="comments"
                          rows={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {isMaster && (
                <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                  <Button onClick={onCancel} type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {task ? "Update" : "Create"} Task
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
        <ImageGrid
          enableButton={isMaster}
          images={images}
          setModalOpen={setModalOpen}
          onImageRemove={onImageRemove}
        />
      </div>
    </>
  );
};
