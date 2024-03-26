"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Save, SaveAll } from "lucide-react";
import { toast } from "sonner";

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
import { Script } from "@prisma/client";

import { scriptInsert, scriptUpdateById } from "@/actions/scripts";
import { ScriptSchema } from "@/schemas";
import { Tiptap } from "@/components/reusable/tiptap";

type ScriptFormProps = {
  script: Script | null;
  setScripts?: React.Dispatch<React.SetStateAction<Script[] | null>>;
};

type ScriptFormValues = z.infer<typeof ScriptSchema>;

export const ScriptForm = ({ script, setScripts }: ScriptFormProps) => {
  const [loading, setLoading] = useState(false);

  const buttonText = script ? "Update" : "Save";

  const form = useForm<ScriptFormValues>({
    mode: "onChange",
    resolver: zodResolver(ScriptSchema),
    defaultValues: script || {
      title: "",
      script: "",
    },
  });

  const onSubmit = async (values: ScriptFormValues) => {
    setLoading(true);
    if (!script) {
      scriptInsert(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          if (setScripts) {
            setScripts((scripts) => {
              return [...scripts!, data.success];
            });
          }
          toast.success("Script created!");
        }
      });
    } else {
      scriptUpdateById(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          console.log(data.success);
          toast.success("Scipt Updated!");
        }
      });
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
