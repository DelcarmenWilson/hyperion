"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, Trash, X } from "lucide-react";
import { Presets } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { presetDeleteById, presetUpdateById } from "@/actions/preset";

interface PresetDataProps {
  preset: Presets;
}

export const PresetData = ({ preset }: PresetDataProps) => {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(preset.content);

  const form = useForm<Presets>({
    defaultValues: preset,
  });

  const onSubmit = (values: Presets) => {
    setContent(values.content);
    startTransition(() => {
      presetUpdateById(values).then((data) => {
        form.reset();
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.error(data.success);
        }
      });
    });
    setEditing(false);
  };
  const onDelete = () => {
    startTransition(() => {
      presetDeleteById(preset.id).then((data) => {
        form.reset();
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.error(data.success);
        }
      });
    });
  };

  return (
    <div>
      {!editing ? (
        <div className="flex gap-2">
          <div className="flex-1 py-3 px-4">
            <p>{content}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outlineprimary"
              size="icon"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} />
            </Button>
            <Button variant="outlinedestructive" size="icon" onClick={onDelete}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 lg:gap-4 w-full"
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        {...field}
                        placeholder="message"
                        required
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outlineprimary" size="icon" type="submit">
                <Check size={16} />
              </Button>
              <Button
                variant="outlinedestructive"
                size="icon"
                onClick={() => setEditing(false)}
              >
                <X className="h4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}
      <Separator className="my-2" />
    </div>
  );
};
