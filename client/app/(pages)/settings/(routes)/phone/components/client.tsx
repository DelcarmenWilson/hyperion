"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneSettings } from "@prisma/client";

import { toast } from "sonner";

import { AudioPlayer } from "@/components/custom/audio-player";
import {
  dialTones,
  newMessageNotifications,
  ringTones,
} from "@/constants/sounds";
import {
  PhoneSettingsSchema,
  PhoneSettingsSchemaType,
} from "@/schemas/phone-settings";
import {
  phoneSettingsUpdate,
  phoneSettingsUpdateVoicemail,
} from "@/actions/settings/phone";
import { TouchPad } from "@/components/phone/addins/touch-pad";

import { RecordModal } from "@/components/modals/record";
import { Input } from "@/components/ui/input";

export const PhoneSettingsClient = ({
  phoneSettings,
}: {
  phoneSettings: PhoneSettings;
}) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const [dialToneCliked, setDialToneCliked] = useState("");

  const [recordingOpen, setRecordingOpen] = useState(false);
  const [voicemail, setVoicemail] = useState<{
    type: string;
    in: string | null;
    out: string | null;
  }>({
    type: "in",
    in: phoneSettings.voicemailIn,
    out: phoneSettings.voicemailOut,
  });

  const onOpenRecording = (e: string) => {
    if (!e) return;
    setVoicemail((state) => {
      return { ...state, type: e };
    });
    setRecordingOpen(true);
  };
  const onRecordingUpdated = async (vm: string) => {
    setRecordingOpen(false);
    const insertedVoicemail = await phoneSettingsUpdateVoicemail(vm);
    if (insertedVoicemail.success) {
      if (voicemail.type == "in") {
        setVoicemail((state) => {
          return { ...state, in: vm };
        });
      } else {
        setVoicemail((state) => {
          return { ...state, out: vm };
        });
      }
      router.refresh();
      toast.success(insertedVoicemail.success);
    } else toast.error(insertedVoicemail.error);
  };

  const form = useForm<PhoneSettingsSchemaType>({
    resolver: zodResolver(PhoneSettingsSchema),
    //@ts-ignore
    defaultValues: phoneSettings,
  });

  const onResetDefaults = () => {
    form.setValue("incoming", "N/A");
    form.setValue("outgoing", "N/A");
    form.setValue("dtmfPack", "N/A");
    form.setValue("messageNotification", "access-allowed");
    form.setValue("messageInternalNotification", "bubble-pop-up");
  };

  const onSubmit = (values: PhoneSettingsSchemaType) => {
    startTransition(() => {
      phoneSettingsUpdate(values)
        .then((data) => {
          if (data.success) toast.success(data.success);
          else toast.error(data.error);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };
  // const isEnabled =
  //   phoneSettings.incoming != form.getValues("incoming") ||
  //   phoneSettings.outgoing != form.getValues("outgoing") ||
  //   phoneSettings.dtmfPack != form.getValues("dtmfPack");

  return (
    <>
      <RecordModal
        type={voicemail.type}
        isOpen={recordingOpen}
        onClose={() => setRecordingOpen(false)}
        onRecordingUpdate={onRecordingUpdated}
      />
      <Form {...form}>
        <form className="space-y-6 mx-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mr-4 lg:mr-0">
            <FormField
              control={form.control}
              name="personalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Personal Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-[50%]"
                      placeholder="3454575869"
                      disabled={loading}
                      autoComplete="phoneNumber"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div />
            {/* INCOMING VOICEMAIl */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3 text-sm">
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
            {/* OUTGOING VOICEMAIl */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3 text-sm">
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
            {/* DIAL TONE PACK */}
            <FormField
              control={form.control}
              name="dtmfPack"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>Dial Tone Pack</FormLabel>
                    <Select
                      name="ddlIncoming"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Dial Tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="N/A">default (twilio)</SelectItem>
                        {dialTones.map((notification, i) => (
                          <SelectItem key={i} value={notification}>
                            {notification}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <TouchPad
                    onNumberClick={setDialToneCliked}
                    displayScript={false}
                    disabled={form.getValues("dtmfPack") == "N/A"}
                    btnHeight="sm"
                  />
                  <AudioPlayer
                    className="hidden"
                    autoPlay
                    src={`/sounds/dialtone/${form.getValues(
                      "dtmfPack"
                    )}-${dialToneCliked}.mp3`}
                  />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              {/* INCOMING RINGTONE */}
              <FormField
                control={form.control}
                name="incoming"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Incoming Ringtone</FormLabel>
                      <Select
                        name="ddlIncoming"
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
                          <SelectItem value="N/A">default (twilio)</SelectItem>
                          {ringTones.map((notification, i) => (
                            <SelectItem key={i} value={notification}>
                              {notification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <AudioPlayer
                      src={`/sounds/ringtone/${form.getValues("incoming")}.mp3`}
                      disabled={form.getValues("incoming") == "N/A"}
                    />
                  </FormItem>
                )}
              />

              {/* OUTGOING RINGTONE */}
              <FormField
                control={form.control}
                name="outgoing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="space-y-0.5">
                      <FormLabel>Outgoing Ringtone</FormLabel>
                      <Select
                        name="ddlOutgoing"
                        disabled={loading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Ringtone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="N/A">default (twilio)</SelectItem>
                          {ringTones.map((notification, i) => (
                            <SelectItem key={i} value={notification}>
                              {notification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <AudioPlayer
                      src={`/sounds/ringtone/${form.getValues("outgoing")}.mp3`}
                      disabled={form.getValues("outgoing") == "N/A"}
                    />
                  </FormItem>
                )}
              />
            </div>
            {/* MESSAGE NOTIFICATION */}
            <FormField
              control={form.control}
              name="messageNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>New Lead Message Notification</FormLabel>
                    <Select
                      name="ddlMessageNotification"
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
                  />
                </FormItem>
              )}
            />

            {/* INTERNAL MESSAGE NOTIFICATION */}
            <FormField
              control={form.control}
              name="messageInternalNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="space-y-0.5">
                    <FormLabel>New Agent Message Notification</FormLabel>
                    <Select
                      name="ddlMessageInternalNotification"
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
                    src={`/sounds/${form.getValues(
                      "messageInternalNotification"
                    )}.wav`}
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
