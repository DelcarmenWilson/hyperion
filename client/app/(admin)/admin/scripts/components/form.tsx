"use client";

import { SaveAll } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScriptActions, useScriptData } from "../hooks/use-script";

import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";

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
import { Script } from "@prisma/client";

type Props = {
  script: Script;
};
export const ScriptForm = ({ script }: Props) => {
  const { loading, onScriptUpdate } = useScriptActions();

  const form = useForm<ScriptSchemaType>({
    mode: "onChange",
    resolver: zodResolver(ScriptSchema),
    defaultValues: script,
  });

  return (
    <div className="flex flex-col h-full w-full pl-1 overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col overflow-hidden space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onScriptUpdate)}
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
              <SaveAll size={16} className="mr-2" />
              Update
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
