"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
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
import { usePhoneContext } from "@/providers/phone";

export const PhoneSettingsForm = ({
  phoneSettings,
}: {
  phoneSettings: PhoneSettings;
}) => {
  const router = useRouter();
  const { phone } = usePhoneContext();
  const { update } = useSession();
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
          if (data.success) {
            const settings = data.success;
            phone?.updateOptions({
              sounds: {
                incoming:
                  settings.incoming != "N/A"
                    ? `/sounds/ringtone/${settings.incoming}.mp3`
                    : undefined,
                outgoing:
                  settings.incoming != "N/A"
                    ? `/sounds/ringtone/${settings.outgoing}.mp3`
                    : undefined,
                dtmf1:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-1.mp3`
                    : undefined,
                dtmf2:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-2.mp3`
                    : undefined,
                dtmf3:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-3.mp3`
                    : undefined,
                dtmf4:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-4.mp3`
                    : undefined,
                dtmf5:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-5.mp3`
                    : undefined,
                dtmf6:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-6.mp3`
                    : undefined,
                dtmf7:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-7.mp3`
                    : undefined,
                dtmf8:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-8.mp3`
                    : undefined,
                dtmf9:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-9.mp3`
                    : undefined,
                dtmf0:
                  settings.dtmfPack != "N/A"
                    ? `/sounds/dialtone/${settings.dtmfPack}-0.mp3`
                    : undefined,
              },
            });
            update();
            toast.success("Phone settings have been updated");
          } else toast.error(data.error);
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
        <form className="mr-0 lg:mr-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="personalNumber"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel> Personal Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full lg:w-[50%]"
                    placeholder="e.g. 3454575869"
                    disabled={loading}
                    autoComplete="phoneNumber"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:mr-0">
            <div className=" rounded-lg border p-3 shadow-sm text-sm">
              <p className="text-xl font-bold">Voicemail Message</p>
              {/* INCOMING VOICEMAIl */}
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <p className=" font-semibold">Incoming</p>
                  <p className="text-muted-foreground">Pre-recorded</p>
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
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <p className=" font-semibold">Outgoing</p>
                  <p className="text-muted-foreground">Pre-recorded</p>
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

            <div className=" rounded-lg border p-3 shadow-sm text-sm">
              <p className="text-xl font-bold">Ringtone</p>
              {/* INCOMING RINGTONE */}
              <FormField
                control={form.control}
                name="incoming"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="py-1">
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
                  <FormItem className="flex  items-center justify-between">
                    <div className="py-1">
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

            <div className=" rounded-lg border p-3 shadow-sm text-sm">
              <p className="text-xl font-bold">New Message Notification</p>
              {/* MESSAGE NOTIFICATION */}
              <FormField
                control={form.control}
                name="messageNotification"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="py-1">
                      <FormLabel>Lead</FormLabel>
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
                      src={`/sounds/${form.getValues(
                        "messageNotification"
                      )}.wav`}
                    />
                  </FormItem>
                )}
              />

              {/* INTERNAL MESSAGE NOTIFICATION */}
              <FormField
                control={form.control}
                name="messageInternalNotification"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="py-1">
                      <FormLabel>Agent</FormLabel>
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

            {/* DIAL TONE PACK */}
            <FormField
              control={form.control}
              name="dtmfPack"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
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
            <div />
            <div className="mt-auto flex flex-col-reverse lg:flex-row justify-end gap-2">
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
          </div>
        </form>
      </Form>
    </>
  );
};
