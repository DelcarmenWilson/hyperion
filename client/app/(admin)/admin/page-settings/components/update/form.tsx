import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PageUpdateSchema, PageUpdateSchemaType } from "@/schemas/admin";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import { useAdminData } from "@/hooks/use-admin";

export const UpdateForm = ({ onClose }: { onClose: () => void }) => {
  const { loading, onPageUpdatedInsert } = useAdminData(onClose);

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

  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onPageUpdatedInsert)}
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
