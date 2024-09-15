"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import {
  NotificationSettingsSchema,
  NotificationSettingsSchemaType,
} from "@/schemas/settings";
import { Heading } from "@/components/custom/heading";

type Props = {
  notificationSettings: NotificationSettings;
  loading: boolean;
  onSubmit: (e: NotificationSettingsSchemaType) => void;
};
export const NotificationForm = ({
  notificationSettings,
  loading,
  onSubmit,
}: Props) => {
  const form = useForm<NotificationSettingsSchemaType>({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: notificationSettings,
  });

  return (
    <>
      <Heading
        title={"Notifications"}
        description="Manage all your Notifications"
      />
      <Form {...form}>
        <form className="px-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                        name="cbCalls"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* APPOINTMENTS */}
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
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* TEXT FORWARDING */}
              <FormField
                control={form.control}
                name="textForward"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Text Forward</FormLabel>
                      <FormDescription>
                        Enable text forwading to your personal number
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="cbTextFoward"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
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
                        name="cbMessages"
                        disabled={loading}
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
                        name="cbVoicemails"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="space-y-1 flex flex-row items-end justify-end  pt-9 mt-3">
                <Button disabled={loading} type="submit">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
