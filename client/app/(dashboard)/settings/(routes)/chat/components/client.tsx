"use client";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChatSettings, User } from "@prisma/client";

import { toast } from "sonner";
import { chatSettingsUpdate } from "@/actions/chat-settings";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { defaultChat } from "@/placeholder/chat";
import { ChatUserSchema } from "@/schemas";
import { RecordModal } from "@/components/modals/record";
import { AudioPlayer } from "@/components/custom/audio-player";
import { newMessageNotifications } from "@/constants/sounds";

type ChatClientProps = {
  data: ChatSettings & { user: User };
};

type ChatValues = z.infer<typeof ChatUserSchema>;

export const ChatClient = ({ data }: ChatClientProps) => {
  const router = useRouter();
  const { update } = useSession();

  const [voicemail, setVoicemail] = useState<{
    type: string;
    in: string | null;
    out: string | null;
  }>({ type: "in", in: data.voicemailIn, out: data.voicemailOut });

  const [recordingOpen, setRecordingOpen] = useState(false);
  const [loading, startTransition] = useTransition();

  const onOpenRecording = (e: string) => {
    if (!e) return;
    setVoicemail((state) => {
      return { ...state, type: e };
    });
    setRecordingOpen(true);
  };
  const onRecordingUpdated = (e: string) => {
    setRecordingOpen(false);
    if (voicemail.type == "in") {
      setVoicemail((state) => {
        return { ...state, in: e };
      });
    } else {
      setVoicemail((state) => {
        return { ...state, out: e };
      });
    }
    router.refresh();

    toast.success("Recording has been updated");
  };

  const form = useForm<ChatValues>({
    resolver: zodResolver(ChatUserSchema),
    defaultValues: data,
  });

  const onResetDefaults = () => {
    form.setValue("defaultPrompt", defaultChat.prompt);
  };

  const onSubmit = (values: ChatValues) => {
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
      <RecordModal
        type={voicemail.type}
        isOpen={recordingOpen}
        onClose={() => setRecordingOpen(false)}
        onRecordingUpdate={onRecordingUpdated}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mr-4 lg:mr-0 text-sm">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
          <div className="space-y-0.5">
            <p className=" font-semibold">Incoming Voicemail Message</p>
            <p className="text-muted-foreground">
              Pre-recorded voicemail message
            </p>
          </div>
          <div>
            <AudioPlayer src={voicemail.in as string} />
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onOpenRecording("in")}
            >
              {voicemail.in ? "New" : "Create"}
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
          <div className="space-y-0.5">
            <p className=" font-semibold">Outgoing Voicemail Message</p>
            <p className="text-muted-foreground">
              Pre-recorded voicemail message
            </p>
          </div>
          <div>
            <AudioPlayer src={voicemail.out as string} />
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onOpenRecording("out")}
            >
              {voicemail.out ? "New" : "Create"}
            </Button>
          </div>
        </div>
      </div>
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
              name="autoChat"
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
            {/* MESSAGE NOTIFICATION */}
            <FormField
              control={form.control}
              name="messageNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>New Message Notification</FormLabel>
                    <Select
                      name="ddlNotification"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Sound" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {newMessageNotifications.map((notification, i) => (
                          <SelectItem key={i} value={notification}>
                            {notification}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <AudioPlayer
                    src={`/sounds/${form.getValues("messageNotification")}.wav`}
                    autoPlay={true}
                  />
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
