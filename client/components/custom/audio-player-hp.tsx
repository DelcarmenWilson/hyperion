"use client";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/audio-player";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateTime } from "@/formulas/dates";
import Hint from "./hint";

type AudioPlayerHpProps = {
  src: string | undefined;
  onListened?: () => void;
};

const AudioPlayerHp = ({ src, onListened }: AudioPlayerHpProps) => {
  const { audio, setAudio } = useAudioStore();
  const {
    audioPlayer,
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    onValueChange,
    onStep,
  } = useAudioPlayer(audio, setAudio, onListened);
  return (
    <div className="bg-background border rounded-sm w-full *:p-1">
      <audio ref={audioPlayer} src={src} preload="metadata" />
      <div className="flex gap-2 items-center justify-center">
        <Hint label="10 sec" side="top" align="center">
          <Button
            className="flex gap-2"
            variant="ghost"
            size="sm"
            onClick={() => onStep(-10)}
          >
            <Rewind size={20} />
          </Button>
        </Hint>
        <Button
          className="rounded-full"
          onClick={togglePlayPause}
          disabled={!src}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Hint label="10 sec" side="top" align="center">
          <Button variant="ghost" size="sm" onClick={() => onStep(10)}>
            <FastForward size={20} />
          </Button>
        </Hint>
      </div>
      <div className="flex gap-2 items-center justify-between ">
        <div className="text-sm w-[90px]">{calculateTime(currentTime)}</div>

        <Slider
          defaultValue={[currentTime]}
          max={duration}
          step={1}
          value={[currentTime]}
          onValueChange={onValueChange}
        />

        <div className="text-sm w-[90px] text-end">
          {isNaN(duration) ? "0:00" : calculateTime(duration)}
        </div>
      </div>
    </div>
  );
};
export default AudioPlayerHp;
