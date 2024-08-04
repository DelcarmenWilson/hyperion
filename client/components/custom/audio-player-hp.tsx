"use client";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateTime } from "@/formulas/dates";
import { useAudio, useAudioPlayer } from "@/hooks/use-audio-player";

type AudioPlayerHpProps = {
  src: string | undefined;
  onListened?: () => void;
};

export const AudioPlayerHp = ({ src, onListened }: AudioPlayerHpProps) => {
  const { audio, setAudio } = useAudio();
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
        <Button
          className="flex gap-2"
          variant="ghost"
          size="sm"
          onClick={() => onStep(-10)}
        >
          <Rewind size={20} />
        </Button>
        <Button
          className="rounded-full"
          onClick={togglePlayPause}
          disabled={!src}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onStep(10)}>
          <FastForward size={20} />
        </Button>
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
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
      </div>
    </div>
  );
};
