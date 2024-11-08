import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AudioPlayer } from "@/components/custom/audio-player";
import { Button } from "@/components/ui/button";

import { phoneSettingsUpdateVoicemail } from "@/actions/settings/phone";
import { RecordModal } from "@/components/modals/record";

type Props = {
  voicemailIn: string | null;
  voicemailOut: string | null;
};
export const VoicemailForm = ({ voicemailIn, voicemailOut }: Props) => {
  const router = useRouter();
  const [voicemail, setVoicemail] = useState<{
    type: string;
    in: string | null;
    out: string | null;
  }>({
    type: "in",
    in: voicemailIn,
    out: voicemailOut,
  });

  const [recordingOpen, setRecordingOpen] = useState(false);

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

  return (
    <>
      <RecordModal
        type={voicemail.type}
        isOpen={recordingOpen}
        onClose={() => setRecordingOpen(false)}
        onRecordingUpdate={onRecordingUpdated}
      />
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
              type="button"
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
              type="button"
            >
              {voicemail.out ? "New" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
