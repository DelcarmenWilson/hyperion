"use client";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAgentTemplateActions } from "../../hooks/use-template";

import { UserTemplate } from "@prisma/client";
import { UserTemplateSchema, UserTemplateSchemaType } from "@/schemas/user";

import { Button } from "@/components/ui/button";

import { DrawerRight } from "@/components/custom/drawer/right";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { ImageUpload } from "@/components/custom/image-upload";
import { KeywordSelect } from "@/components/custom/keyword-select";
import { Textarea } from "@/components/ui/textarea";

type TemplateDrawerProps = {
  template?: UserTemplate;
  open: boolean;
  onClose: () => void;
};
const TemplateDrawer = ({ template, open, onClose }: TemplateDrawerProps) => {
  const title = template ? "Edit Template" : "New Template";
  const {
    onCreateTemplate,
    templateCreating,
    onUpdateTemplate,
    templateUpdating,
  } = useAgentTemplateActions(onClose);
  return (
    <DrawerRight title={title} isOpen={open} onClose={onClose}>
      <TemplateForm
        template={template}
        loading={template ? templateUpdating : templateCreating}
        onSubmit={template ? onUpdateTemplate : onCreateTemplate}
        onClose={onClose}
      />
    </DrawerRight>
  );
};

type TemplateFormProps = {
  template?: UserTemplate;
  loading: boolean;
  onSubmit: (e: UserTemplateSchemaType) => void;
  onClose: () => void;
};

const TemplateForm = ({
  template,
  loading,
  onSubmit,
  onClose,
}: TemplateFormProps) => {
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
export default TemplateDrawer;
