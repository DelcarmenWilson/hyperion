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

type ChatClientProps = {
  data: ChatSettings & { user: User };
};

type ChatValues = z.infer<typeof ChatUserSchema>;

export const ChatClient = ({ data }: ChatClientProps) => {
  const router = useRouter();

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

            {/* RECORD */}
            <FormField
              control={form.control}
              name="record"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Recording</FormLabel>
                    <FormDescription>Recording calls</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      name="cblRecord"
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
