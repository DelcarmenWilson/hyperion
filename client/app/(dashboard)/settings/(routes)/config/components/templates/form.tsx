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

type TemplateFormProps = {
  template?: UserTemplate;
  onClose: () => void;
};

type TemplateFormValues = z.infer<typeof UserTemplateSchema>;

export const TemplateForm = ({ template, onClose }: TemplateFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{
    image: string | undefined;
    filename: string | undefined;
  }>({ image: undefined, filename: undefined });
  const imgPath = "/assets/user-templates/";
  const btnText = template ? "Update" : "Create";

  const form = useForm<TemplateFormValues>({
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
  const onImageUpdate = (imageUrl: string, image: string, filename: string) => {
    setFile({ image, filename });
    form.setValue("attachment", imageUrl);
  };
  const onImageRemove = () => {
    setFile({ image: undefined, filename: undefined });
    form.setValue("attachment", undefined);
  };
  const onSubmit = async (values: TemplateFormValues) => {
    setLoading(true);
    let newFileName = `${imgPath}${file.filename}`;

    if (file.image) {
      values.attachment = newFileName;
    }
    if (template)
      userTemplateUpdateById(values).then((data) => {
        if (data.success) {
          userEmitter.emit("templateUpdated", data.success);
          router.refresh();
          onCancel();
          toast.success("Template created!");
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    else {
      const data = await userTemplateInsert(values);
      if (data.success) {
        // if (file.image) {
        //   await axios
        //     .put("/api/upload/rename", {
        //       oldFileName: file.image,
        //       newFileName: newFileName,
        //     })
        //     .then((response) => {
        //       const data = response.data;
        //       if (data.error) toast.error(data.error);
        //     });
        // }
        onCancel();
        router.refresh();
        userEmitter.emit("templateInserted", data.success);
        toast.success("Template created!");
      }
      if (data.error) {
        toast.error(data.error);
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
            filePath={imgPath}
            oldImage={template?.attachment}
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
