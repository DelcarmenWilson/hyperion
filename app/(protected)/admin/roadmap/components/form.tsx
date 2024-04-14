import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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

import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Roadmap } from "@prisma/client";
import { RoadmapSchema } from "@/schemas";
import { adminRoadmapInsert, adminRoadmapUpdateById } from "@/actions/admin";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DefaultStatus } from "@/constants/texts";

type RoadmapFormProps = {
  roadmap?: Roadmap | null;
  onClose?: (e?: Roadmap) => void;
};

type RoadmapFormValues = z.infer<typeof RoadmapSchema>;

export const RoadmapForm = ({ roadmap = null, onClose }: RoadmapFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(RoadmapSchema),
    defaultValues: roadmap || {
      headLine: "",
      description: "",
      status: "Pending",
      comments: undefined,
      startAt: new Date(),
      endAt: new Date(),
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: RoadmapFormValues) => {
    setLoading(true);

    if (roadmap) {
      adminRoadmapUpdateById(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      adminRoadmapInsert(values).then((data) => {
        if (data.success) {
          form.reset();
          if (onClose) onClose(data.success);
          toast.success("Task created!");
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
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
            {/* HEADLINE */}
            <FormField
              control={form.control}
              name="headLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Headline
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Lead Page"
                      disabled={loading}
                      autoComplete="HeadLine"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DESCRIPTION*/}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Description
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description"
                      disabled={loading}
                      autoComplete="Description"
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                          date < new Date() || date < new Date("1900-01-01")
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
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* STATUS */}
            {roadmap && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel> Status</FormLabel>
                    <Select
                      name="ddlStatus"
                      disabled={loading}
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
            )}
            {/* PUBLISHED*/}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Published</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblPublished"
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                    />
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
              {roadmap ? "Update" : "Create"} Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
