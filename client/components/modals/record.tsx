"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AudioLinesIcon, Mic, Pause } from "lucide-react";

// import { MediaRecorder, register } from "extendable-media-recorder";
// import { connect } from "extendable-media-recorder-wav-encoder";

import { AudioPlayer } from "@/components/custom/audio-player";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";
import { handleFileUpload } from "@/lib/utils";

type RecordModalProps = {
  type: string;
  oldFile?: string;
  isOpen: boolean;
  onClose: () => void;
  onRecordingUpdate: (e: string) => void;
};
export const RecordModal = ({
  type,
  oldFile,
  isOpen,
  onClose,
  onRecordingUpdate,
}: RecordModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState("");
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setAudio(URL.createObjectURL(file));
      setFile(file);
    }
  };
  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    console.log(file);
    // const voicemail = await handleFileUpload({
    //   newFile: file,
    //   filePath: "voicemail",
    //   oldFile: oldFile,
    // });
    // onRecordingUpdate(voicemail);
    setAudio("");
    setFile(undefined);
    setUploading(false);
  };
  const startRecording = async () => {
    setIsRecording(true);
    mediaRef.current = null;
    audioChunksRef.current = [];

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
        },
      })
      .then((stream) => {
        const medaiRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 128000,
        });
        mediaRef.current = medaiRecorder;
        medaiRecorder.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          audioChunksRef.current.push(event.data);
        };

        medaiRecorder.start();
      });
  };
  const stopRecording = () => {
    if (!mediaRef.current) return;
    const tracks = mediaRef.current.stream.getAudioTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    mediaRef.current.stop();
    mediaRef.current.onstop = async () => {
      // const audioBlob = new Blob(audioChunksRef.current, {
      //   type: "audio/mp3",
      // });
      const audioBlob = new Blob(audioChunksRef.current);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      // setFile(new File([audioBlob], "newrecording.mp3"));
      setFile(new File([audioBlob], "newrecording"));
    };

    setIsRecording(false);
  };

  const onCancel = () => {
    setFile(undefined);
    setAudio("");
    onClose();
  };

  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        const tracks = mediaRef.current.stream.getAudioTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={`Upload ${
        type == "in" ? "Incoming" : "Outgoing"
      } Voicemail Recording`}
      description="Previous Recording will be replaced"
      isOpen={isOpen}
      onClose={onClose}
      height="min-h-[400px]"
    >
      <div className="flex flex-col justify-center items-center">
        <input
          ref={inputRef}
          type="file"
          accept="audio/mp3"
          hidden
          multiple={false}
          onChange={onFileChange}
        />
        <div className="rounded flex items-center justify-center border-2 border-dashed p-2">
          <div className="flex flex-col gap-2 justify-center items-center">
            {audio ? <AudioPlayer src={audio} /> : <AudioLinesIcon size={32} />}
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => inputRef.current?.click()}>
                Select Recording
              </Button>
              |
              {isRecording ? (
                <Button
                  className="mt-10 rounded-full m-auto"
                  variant="destructive"
                  size="icon"
                  onClick={stopRecording}
                >
                  <Pause size={16} />
                </Button>
              ) : (
                <Button
                  className="mt-10 rounded-full m-auto"
                  size="icon"
                  onClick={startRecording}
                >
                  <Mic size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6 flex gap-2 items-center justify-center">
        <Button
          disabled={uploading}
          variant="outline"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        {file && (
          <Button disabled={uploading} onClick={onUpload} type="button">
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        )}
      </div>
    </Modal>
  );
};
