"use client";
import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { handleFileUpload } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { UserTemplate } from "@prisma/client";
import { UserTemplateSchema, UserTemplateSchemaType } from "@/schemas/user";

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
import { ImageUpload } from "@/components/custom/image-upload";
import { KeywordSelect } from "@/components/custom/keyword-select";

import { userTemplateInsert, userTemplateUpdateById } from "@/actions/user";

type TemplateFormProps = {
  template?: UserTemplate;
  onClose: () => void;
};

export const TemplateForm = ({ template, onClose }: TemplateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{
    image: File | null;
    url: string | null;
  }>({ image: null, url: null });
  const btnText = template ? "Update" : "Create";

  const form = useForm<UserTemplateSchemaType>({
    resolver: zodResolver(UserTemplateSchema),
    //@ts-ignore
    defaultValues: template || {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onImageRemove();
    onClose();
  };
  const onSetKeyWord = (e: string) => {
    const msg = form.getValues("message");
    form.setValue("message", `${msg || ""} ${e}`);
  };
  const onImageUpdate = (image: File, url: string) => {
    setFile({ image, url });
    form.setValue("attachment", url);
  };
  const onImageRemove = () => {
    setFile({ image: null, url: null });
    form.setValue("attachment", undefined);
  };
  const onSubmit = async (values: UserTemplateSchemaType) => {
    setLoading(true);

    if (file.image) {
      values.attachment = await handleFileUpload({
        newFile: file.image,
        filePath: "user-templates",
        oldFile: template?.attachment,
      });
    }
    if (template) {
      const updatedTemplate = await userTemplateUpdateById(values);
      if (updatedTemplate.success) {
        userEmitter.emit("templateUpdated", updatedTemplate.success);
        onCancel();
        toast.success("Template created!");
      }
      if (updatedTemplate.error) {
        toast.error(updatedTemplate.error);
      }
    } else {
      const insertData = await userTemplateInsert(values);
      if (insertData.success) {
        userEmitter.emit("templateInserted", insertData.success);
        toast.success("Template created!");
        onCancel();
      }
      if (insertData.error) {
        toast.error(insertData.error);
      }
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
          <ImageUpload
            selectedImage={form.getValues("attachment")!}
            onImageUpdate={onImageUpdate}
            onImageRemove={onImageRemove}
          />
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
            <KeywordSelect onSetKeyWord={onSetKeyWord} />

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
              {btnText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
