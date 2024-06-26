"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Save, SaveAll } from "lucide-react";
import { toast } from "sonner";

import { Script } from "@prisma/client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/reusable/tiptap";

import { scriptInsert, scriptUpdateById } from "@/actions/script";
import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";

type ScriptFormProps = {
  script: Script | null;
  setScripts?: React.Dispatch<React.SetStateAction<Script[] | null>>;
};

export const ScriptForm = ({ script, setScripts }: ScriptFormProps) => {
  const [loading, setLoading] = useState(false);

  const buttonText = script ? "Update" : "Save";

  const form = useForm<ScriptSchemaType>({
    mode: "onChange",
    resolver: zodResolver(ScriptSchema),
    defaultValues: script || {
      title: "",
      script: "",
    },
  });

  const onSubmit = async (values: ScriptSchemaType) => {
    setLoading(true);
    if (!script) {
      const insertScript = await scriptInsert(values);
      if (insertScript.success) {
        if (setScripts) {
          setScripts((scripts) => {
            return [...scripts!, insertScript.success];
          });
        }
        toast.success("Script created!");
      } else toast.error(insertScript.error);
    } else {
      const updatedScript = await scriptUpdateById(values);
      if (updatedScript.success) {
        toast.success("Script Updated!");
      } else toast.error(updatedScript.error);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col h-full w-full pl-1 overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col overflow-hidden space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-between items-end mb-2 gap-4">
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Script Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Basic Script"
                      disabled={loading}
                      autoComplete="title"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {script ? (
                <SaveAll size={16} className="mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}

              {buttonText}
            </Button>
          </div>

          {/* TITLE */}
          <FormField
            control={form.control}
            name="script"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 w-full overflow-hidden">
                <FormLabel> Script</FormLabel>
                <FormControl>
                  <Tiptap description={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
