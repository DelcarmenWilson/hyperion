"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ChatSettings, User } from "@prisma/client";
import {
  ChatSettingsSchema,
  ChatSettingsSchemaType,
} from "@/schemas/chat-settings";

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

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { defaultChat } from "@/placeholder/chat";
import { chatSettingsUpdate } from "@/actions/settings/chat";

type Props = { chatSettings: ChatSettings };
export const ChatClient = ({ chatSettings }: Props) => {
  const router = useRouter();
  const { update } = useSession();

  const [loading, startTransition] = useTransition();

  const form = useForm<ChatSettingsSchemaType>({
    resolver: zodResolver(ChatSettingsSchema),
    defaultValues: chatSettings,
  });

  const onResetDefaults = () => {
    form.setValue("defaultPrompt", defaultChat.prompt);
  };

  const onSubmit = (values: ChatSettingsSchemaType) => {
    startTransition(() => {
      chatSettingsUpdate(values)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            update();
          } else toast.error(data.error);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
      router.refresh();
    });
  };
  return (
    <>
      <Form {...form}>
        <form className="space-y-6 mx-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mr-4 lg:mr-0">
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
                      rows={7}
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
                      rows={7}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AUTO CHAT */}
            <FormField
              control={form.control}
              name="titan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Titan</FormLabel>
                    <FormDescription>Automatic messaging</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblAutoChat"
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ONLINE */}
            <FormField
              control={form.control}
              name="online"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Show Only Online User</FormLabel>
                    <FormDescription>
                      Only show online users in the side bar chat
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblOnline"
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* COACH */}
            <FormField
              control={form.control}
              name="coach"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Coach</FormLabel>
                    <FormDescription>
                      Enable coahing (future feature)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblCoach"
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
    </>
  );
};
