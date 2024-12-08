"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useScriptActions,
  useScriptData,
  useScriptStore,
} from "@/hooks/admin/use-script";

import { Script } from "@prisma/client";
import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import FormInput from "./form-input";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modals/modal";

export const ScriptForm = () => {
  const { isScriptFormOpen, onScriptFormClose } = useScriptStore();
  const { onGetScript } = useScriptData();
  const { script } = onGetScript();
  const {
    onScriptInsert,
    isPendingScriptInsert,
    onScriptUpdate,
    isPendingScriptUpdate,
  } = useScriptActions();
  const title = script ? ` - ${script.name}` : "";
  return (
    <Modal
      isOpen={isScriptFormOpen}
      onClose={onScriptFormClose}
      title={`Script ${title}`}
      description="Script Form"
      width="w-full"
    >
      <SpForm
        script={script || undefined}
        loading={script ? isPendingScriptUpdate : isPendingScriptInsert}
        onClose={onScriptFormClose}
        onSubmit={script ? onScriptUpdate : onScriptInsert}
      />
    </Modal>
  );
};

type SpFormProps = {
  script?: Script;
  loading: boolean;
  onSubmit: (e: ScriptSchemaType) => void;
  onClose: () => void;
};
const SpForm = ({ script, loading, onClose, onSubmit }: SpFormProps) => {
  const btnText = script ? "Update" : "Create";

  const form = useForm<ScriptSchemaType>({
    resolver: zodResolver(ScriptSchema),
    //@ts-ignore
    defaultValues: script || {
      title: "",
      content: "",
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
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Status Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Sample Script"
                    disabled={loading}
                    autoComplete="title"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* DESCRIPTION*/}
          {/* <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel className="flex justify-between items-center">
                  Content
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Script Content goes here"
                    disabled={loading}
                    autoComplete="Content"
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
          <FormInput placeholder="Script content goes here" />
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
  );
};
