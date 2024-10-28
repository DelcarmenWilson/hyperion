"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useNotificationActions,
  useNotificationData,
} from "../config/hooks/use-config";

import { NotificationSettings } from "@prisma/client";
import {
  NotificationSettingsSchema,
  NotificationSettingsSchemaType,
} from "@/schemas/settings";

import { Button } from "@/components/ui/button";
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

import { Switch } from "@/components/ui/switch";
import { Heading } from "@/components/custom/heading";

type Props = {
  notificationSettings: NotificationSettings;
};
export const NotificationForm = ({ notificationSettings }: Props) => {
  const { notificationSettingsIsPending, onNotificationSettingsSubmit } =
    useNotificationActions();

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
        <form
          className="px-1"
          onSubmit={form.handleSubmit(onNotificationSettingsSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div>
              {/* CALLS */}
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
                        disabled={notificationSettingsIsPending}
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
                        name="cbAppointments"
                        disabled={notificationSettingsIsPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* BLUEPRINT */}
              <FormField
                control={form.control}
                name="blueprint"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Blueprint</FormLabel>
                      <FormDescription>
                        Enable notifications for blueprint (Daily)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="cblBluePrint"
                        disabled={notificationSettingsIsPending}
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
                        disabled={notificationSettingsIsPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              {/* MESSAGES */}
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
                        disabled={notificationSettingsIsPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* VOICEMAILS */}
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
                        disabled={notificationSettingsIsPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* UPDATES */}
              <FormField
                control={form.control}
                name="updates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Updates</FormLabel>
                      <FormDescription>
                        Enable notifications for updates
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="cbUpdated"
                        disabled={notificationSettingsIsPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="space-y-1 flex flex-row items-end justify-end  pt-9 mt-3">
                <Button disabled={notificationSettingsIsPending} type="submit">
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
