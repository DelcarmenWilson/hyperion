"use client";
import * as z from "zod";
import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

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
import { userTemplateInsert, userTemplateUpdateById } from "@/actions/user";
import { ImageUpload } from "@/components/custom/image-upload";
import axios from "axios";
import { KeywordSelect } from "@/components/custom/keyword-select";
import { useRouter } from "next/navigation";
import { computeSHA256, handleFileUpload } from "@/lib/utils";
import { getSignedURL } from "@/actions/upload";

type TemplateFormProps = {
  template?: UserTemplate;
  onClose: () => void;
};

type TemplateFormValues = z.infer<typeof UserTemplateSchema>;

export const TemplateForm = ({ template, onClose }: TemplateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{
    image: File | null;
    url: string | null;
  }>({ image: null, url: null });

  const imgPath = "/user-templates/";
  const btnText = template ? "Update" : "Create";

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(UserTemplateSchema),
    //@ts-ignore
    defaultValues: template || {},
  });

  // const handleFileUpload = async (file: File, path: string = "temp") => {
  //   const signedURLResult = await getSignedURL({
  //     fileSize: file.size,
  //     fileType: file.type,
  //     filePath: "user-templates",
  //     checksum: await computeSHA256(file),
  //   });
  //   if (signedURLResult.error !== undefined) {
  //     throw new Error(signedURLResult.error);
  //   }
  //   const url = signedURLResult.success;
  //   await axios.put(url, file, { headers: { "Content-Type": file.type } });
  //   const fileUrl = url.split("?")[0];
  //   return fileUrl;
  // };

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
  const onSubmit = async (values: TemplateFormValues) => {
    setLoading(true);

    if (file.image) {
      values.attachment = await handleFileUpload(file.image, "user-templates");
    }
    if (template) {
      //TODO replace the old file if exist
      const updateData = await userTemplateUpdateById(values);
      if (updateData.success) {
        userEmitter.emit("templateUpdated", updateData.success);
        onCancel();
        toast.success("Template created!");
      }
      if (updateData.error) {
        toast.error(updateData.error);
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
