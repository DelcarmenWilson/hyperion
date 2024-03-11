"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Mic, Pause } from "lucide-react";
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
export const RecordView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscript(transcript);
    };
    recognitionRef.current.start();
  };
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center h-screen">
      <div className="w-full">
        {(isRecording || transcript) && (
          <div className="w-1/4 rounded-md border p-4 bg-white">
            <div className="flex flex-1 w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {recordingComplete ? "Recorded" : "Recording"}
                </p>
                <p className="text-sm">
                  {recordingComplete ? "Thanks for talking" : "Start speaking"}
                </p>
              </div>
            </div>
            {isRecording && (
              <div className=" rounded-full w-4 h-4 bg-red-400 animate-pulse"></div>
            )}
          </div>
        )}
        {transcript && (
          <div className="border rounded-md p-2 mt-4">
            <p className="mb-0">{transcript}</p>
          </div>
        )}

        <div className="flex items-center w-full">
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
  );
};

// class ChatAudio {
//   constructor() {
//       recorder
//       this.recording = false
//       this.starttime
//   }

//   recordAudio = () =>
//       new Promise(async resolve => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//           const mediaRecorder = new MediaRecorder(stream)
//           const audioChunks = []

//           mediaRecorder.addEventListener('dataavailable', event => {
//               audioChunks.push(event.data)
//           })

//           const start = () => {
//               mediaRecorder.start()
//               this.starttime = new Date().getTime()
//               this.recording = true
//           }

//           const stop = () =>
//               new Promise(resolve => {
//                   mediaRecorder.addEventListener('stop', () => {
//                       const stoptime = new Date().getTime()
//                       const len = stoptime - this.starttime
//                       const filename = `${new Date().getTime()}.wav`
//                       const file = new File(audioChunks, filename, { 'type': 'audio/wav', 'length': len })
//                       resolve({ file })
//                   })
//                   mediaRecorder.stop()
//                   this.recording = false
//               })
//           resolve({ start, stop })
//       })

//   startaudio = (async function () {
//       this.recorder = await this.recordAudio()
//       this.recorder.start()
//   })
//   stopaudio = (async function () {
//       const audio = await this.recorder.stop()
//       return audio.file
//   })
// }
