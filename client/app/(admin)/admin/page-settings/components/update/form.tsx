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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { useAdminData } from "@/hooks/admin/use-admin";
import { ImageUpload } from "@/components/custom/image-upload";
import { useState } from "react";

export const UpdateForm = ({ onClose }: { onClose: () => void }) => {
  const { loading, onPageUpdatedInsert } = useAdminData(onClose);
  const [file, setFile] = useState<{
    image: File | null;
    url: string | null;
  }>({ image: null, url: null });

  const form = useForm<PageUpdateSchemaType>({
    resolver: zodResolver(PageUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Change",
    },
  });

  const onImageUpdate = (image: File, url: string) => {
    setFile({ image, url });
    form.setValue("image", url);
  };
  const onImageRemove = () => {
    setFile({ image: null, url: null });
    form.setValue("image", undefined);
  };

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onImageRemove();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit((e) =>
            onPageUpdatedInsert(e, file?.image)
          )}
        >
          <div className="flex flex-col gap-2">
            <ImageUpload
              selectedImage={form.getValues("image")!}
              onImageUpdate={onImageUpdate}
              onImageRemove={onImageRemove}
            />
            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="ddlType"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Add">Add</SelectItem>
                      <SelectItem value="Bug-Fix">Bug Fix</SelectItem>
                      <SelectItem value="Change">Change</SelectItem>
                      <SelectItem value="Delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* NAME */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Title
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
