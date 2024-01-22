"use client";
import { useForm } from "react-hook-form";

import { AlertCircle, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { presetKeywords } from "@/constants/texts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { presetCreate } from "@/data/actions/preset";
import { toast } from "sonner";
import { PresetFormValues } from "@/types";
import { Preset } from "@prisma/client";

interface PresetFormProps {
  type: Preset;
}
export const PresetForm = ({ type }: PresetFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PresetFormValues>({
    defaultValues: {
      type: type,
      content: "",
    },
  });

  const onSubmit = (values: PresetFormValues) => {
    startTransition(() => {
      presetCreate(values).then((data) => {
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
                    />
                    <Smile className="absolute text-primary -right-2.5 -top-2.5" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between font-light text-xs gap-2">
            <div className="flex flex-col gap-2">
              <p>48/700 (1 test message)</p>
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
