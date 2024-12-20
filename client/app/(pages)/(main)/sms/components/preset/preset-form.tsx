"use client";
import { useState, useTransition } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAiGeneratorStore } from "@/stores/ai-generator-store";

import { AlertCircle, Smile, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Preset } from "@prisma/client";
import { PresetSchema, PresetSchemaType } from "@/schemas/settings";
import { presetKeywords } from "@/constants/texts";
import { presetInsert } from "@/actions/user/preset";

type PresetFormProps = {
  type: Preset;
  content?: string;
};
export const PresetForm = ({ type, content = "" }: PresetFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(content.length);
  const { onAiGeneratorOpen } = useAiGeneratorStore();

  const form = useForm<PresetSchemaType>({
    resolver: zodResolver(PresetSchema),
    defaultValues: {
      type: type,
      content: content,
    },
  });

  const onSubmit = async (values: PresetSchemaType) => {
    startTransition(async () => {
      const insertedPreset = await presetInsert(values);
      if (insertedPreset.success) {
        userEmitter.emit("presetInserted", insertedPreset.success);
        toast.success("Preset added!!");
      } else toast.error(insertedPreset.error);

      form.reset();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="text-destructive">
            <AlertCircle className="h-4 w-4 float-start mr-1" />
            Per CTIA regulations, you must include the name of the company you
            represent and your name in the first text message that is send to
            your leads.
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative mx-2">
                    <Textarea
                      disabled={isPending}
                      {...field}
                      placeholder="message"
                      // onChange={(e) => setCount(e.target.value.length)}
                    />
                    <Smile className="absolute text-primary -right-2.5 -top-2.5" />
                    <Button
                      variant="ghost"
                      className="absolute bottom-0 right-0 rounded-full"
                      type="button"
                      onClick={() =>
                        onAiGeneratorOpen((e) => {
                          form.setValue("content", e);
                        })
                      }
                    >
                      <Star size={16} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between font-light text-xs gap-2">
            <div className="flex flex-col gap-2">
              <p>{count}/700 (1 test message)</p>
              <p>
                Opt-out notice: ...If this was a mistake, please reply cancel
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">
                Include opt-in notice in estimate cost? <Switch name="opting" />
              </p>
              <p>Estimated cost: $0.01</p>
            </div>
          </div>
          <p className="text-xs font-light">
            <span className="font-bold">Available keyworkds: </span>
            {presetKeywords}
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Upload image?
            </label>
          </div>
        </div>
        <div className="text-right">
          <Button type="submit">SAVE TEXT</Button>
        </div>
      </form>
    </Form>
  );
};
