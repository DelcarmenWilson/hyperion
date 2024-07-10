import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  PageUpdateSchema,
  PageUpdateSchemaType,
  QuoteSchema,
  QuoteSchemaType,
} from "@/schemas/admin";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { adminQuoteInsert } from "@/actions/admin/quote";
import { PageUpdate } from "@prisma/client";
import { pageUpdateInsert } from "@/actions/page-update";

export const UpdateForm = ({
  onClose,
}: {
  onClose?: (e?: PageUpdate) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<PageUpdateSchemaType>({
    resolver: zodResolver(PageUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: PageUpdateSchemaType) => {
    setLoading(true);
    const insertedUpdate = await pageUpdateInsert(values);
    if (insertedUpdate.success) {
      form.reset();
      if (onClose) onClose(insertedUpdate.success);
      toast.success("Update created!");
    } else toast.error(insertedUpdate.error);
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
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Update Name"
                      disabled={loading}
                      autoComplete="off"
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
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Description
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter Description"
                      disabled={loading}
                      autoComplete="Description"
                      rows={6}
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
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
