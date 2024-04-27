"use client";
import * as z from "zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

import { UserTemplate } from "@prisma/client";

import { Textarea } from "@/components/ui/textarea";
import { UserTemplateSchema } from "@/schemas";
import { userTemplateInsert } from "@/actions/user";
import { ImageUpload } from "@/components/custom/image-upload";
import axios from "axios";
import { KeyworkSelect } from "@/components/custom/keyword-select";

type UserTemplateFormProps = {
  onClose?: (e?: UserTemplate) => void;
};

type UserTemplateFormValues = z.infer<typeof UserTemplateSchema>;

export const UserTemplateForm = ({ onClose }: UserTemplateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();

  const form = useForm<UserTemplateFormValues>({
    resolver: zodResolver(UserTemplateSchema),
    defaultValues: {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) onClose();
  };
  const onSetKeyWord = (e: string) => {
    const msg = form.getValues("message");
    form.setValue("message", `${msg || ""} ${e}`);
  };
  const onImageUpdate = (file: File) => {
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };
  const onSubmit = async (values: UserTemplateFormValues) => {
    setLoading(true);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("filePath", "assets/templates");
      const response = await axios.post("/api/upload/image", formData);
      const data = await response.data;
      if (data.success) {
        values.attachment = data.success;
      }
      if (data.error) {
        toast.error("Image was not able to be uploaded!");
      }
    }
    userTemplateInsert(values).then((data) => {
      if (data.success) {
        form.reset();
        if (onClose) onClose(data.success);
        toast.success("Template created!");
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };
  return (
    <div>
      <ImageUpload
        selectedImage={selectedImage as string}
        onImageUpdate={onImageUpdate}
      />
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
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Business Card"
                      disabled={loading}
                      autoComplete="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* MESSAGE */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Message
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template message here"
                      disabled={loading}
                      rows={5}
                      autoComplete="message"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <KeyworkSelect onSetKeyWord={onSetKeyWord} />

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
                      placeholder="Business to send to the lead"
                      disabled={loading}
                      rows={5}
                      autoComplete="description"
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
