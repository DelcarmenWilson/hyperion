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
import { ChatSettingsUpdate } from "@/actions/chat-settings";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { defaultMessage, defaultPrompt } from "@/placeholder/chat";

interface ChatClientProps {
  data: ChatSettings & { user: User };
}

const formSchema = z.object({
  userId: z.string(),
  initialPrompt: z.optional(z.string()),
  initialMessage: z.optional(z.string()),
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
    const prompt = defaultPrompt().replace(
      "{AGENT_NAME}",
      data.user.name as string
    );
    const message = defaultMessage().replace(
      "{AGENT_NAME}",
      data.user.name as string
    );
    form.setValue("initialPrompt", prompt);
    form.setValue("initialMessage", message);
  };
  const onSubmit = (values: ChatValues) => {
    startTransition(() => {
      ChatSettingsUpdate(values)
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
              <FormField
                control={form.control}
                name="initialPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Initial Prompt"
                        disabled={loading}
                        autoComplete="prompt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LEAD INFO */}
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

              {/* INITIAL MESSAGE */}
              <FormField
                control={form.control}
                name="initialMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Initial Message"
                        disabled={loading}
                        autoComplete="prompt"
                      />
                    </FormControl>
                    <FormMessage />
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
