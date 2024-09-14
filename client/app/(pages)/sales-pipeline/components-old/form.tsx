import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/modal";

import { PipeLine } from "@prisma/client";
import { PipelineSchemaType, PipelineSchema } from "@/schemas/pipeline";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/providers/global";
import { pipelineInsert } from "@/actions/pipeline";

export const PipelineForm = ({ info }: { info?: PipeLine }) => {
  const { leadStatus } = useGlobalContext();
  const { setClose } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<PipelineSchemaType>({
    resolver: zodResolver(PipelineSchema),
    defaultValues: info || {
      statusId: leadStatus ? leadStatus[0].id : undefined,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    setClose();
  };

  const onPipelineSubmit = async (values: PipelineSchemaType) => {
    setLoading(true);
    const insertedPipeline = await pipelineInsert(values);
    if (insertedPipeline.success) {
      toast.success(insertedPipeline.success);
      router.refresh();
      setClose();
    } else toast.error(insertedPipeline.error);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-2 px-2 w-full"
        onSubmit={form.handleSubmit(onPipelineSubmit)}
      >
        {/* STATUS */}
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                Status <FormMessage />
              </FormLabel>
              <Select
                name="ddlStatus"
                disabled={loading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status " />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leadStatus?.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                Name
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="New leads"
                  disabled={loading}
                  autoComplete="Title"
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
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
