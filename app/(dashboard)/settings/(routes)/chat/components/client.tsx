"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChatSettings, User } from "@prisma/client";

import { toast } from "sonner";
import { chatSettingsUpdate } from "@/actions/chat-settings";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { defaultChat } from "@/placeholder/chat";

interface ChatClientProps {
  data: ChatSettings & { user: User };
}

const formSchema = z.object({
  userId: z.string(),
  defaultPrompt: z.optional(z.string()),
  defaultMessage: z.optional(z.string()),
  defaultFunction: z.optional(z.string()),
  leadInfo: z.boolean(),
});

type ChatValues = z.infer<typeof formSchema>;

export const ChatClient = ({ data }: ChatClientProps) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const form = useForm<ChatValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const onResetDefaults = () => {
    form.setValue("defaultPrompt", defaultChat.prompt);
    form.setValue("defaultMessage", defaultChat.message);
  };

  const onSubmit = (values: ChatValues) => {
    startTransition(() => {
      chatSettingsUpdate(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
      router.refresh();
    });
  };
  return (
    <div className="w-[50%] h-full rounded-none">
      <div className="flex justify-center items-center text-2xl font-semibold p-2">
        <MessageCircle className="mr-2 h-5 w-5" /> Chat Settings
      </div>
      <Separator />
      <div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-4">
              {/* DEFAULT PROMPT */}
              <FormField
                control={form.control}
                name="defaultPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="default Prompt"
                        disabled={loading}
                        autoComplete="defaultPrompt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* DEFAULT MESSAGE */}
              <FormField
                control={form.control}
                name="defaultMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      Message{" "}
                      <span className="text-destructive font-bold ialic">
                        Depricated!! Please use presets
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Default message"
                        disabled={loading}
                        autoComplete="defaultMessage"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DEFAULT FUNCTION */}
              <FormField
                control={form.control}
                name="defaultFunction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Function</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Default function"
                        disabled={loading}
                        autoComplete="defaultFunction"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* SEND LEAD INFO */}
              <FormField
                control={form.control}
                name="leadInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Lead Info</FormLabel>
                      <FormDescription>
                        Send lead info with the intial prompt
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="cblIsTwoFactor"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                disabled={loading}
                variant="outline"
                onClick={onResetDefaults}
                type="button"
              >
                Reset Defaults
              </Button>
              <Button disabled={loading} type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
