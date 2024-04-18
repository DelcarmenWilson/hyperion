"use client";
import { useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NotificationSettings } from "@prisma/client";

import { NotificationSettingsSchema } from "@/schemas";
import { notificationSettingsUpdateByUserId } from "@/actions/notification-settings";

type NotificationClientValues = z.infer<typeof NotificationSettingsSchema>;
type NotificationClientProps = {
  notificationSettings: NotificationSettings;
};
export const NotificationClient = ({
  notificationSettings,
}: NotificationClientProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<NotificationClientValues>({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: notificationSettings,
  });

  const onSubmit = (values: NotificationClientValues) => {
    startTransition(() => {
      notificationSettingsUpdateByUserId(values)
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
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 px-1" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Personal Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="345-457-5869"
                      disabled={isPending}
                      autoComplete="phoneNumber"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="calls"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Calls</FormLabel>
                    <FormDescription>
                      Enable notifications for calls
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblCalls"
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Appointments</FormLabel>
                    <FormDescription>
                      Enable notifications for appointments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblAppointments"
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="messages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Messages</FormLabel>
                    <FormDescription>
                      Enable notifications for messages
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblMessages"
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voicemails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Voicemails</FormLabel>
                    <FormDescription>
                      Enable notifications for voicemails
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblVoicemails"
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button disabled={isPending} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
