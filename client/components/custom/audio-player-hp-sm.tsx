"use client";
import { Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/audio-player";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateTime } from "@/formulas/dates";

type Props = {
  src: string | undefined;
};

const AudioPlayerHpSm = ({ src }: Props) => {
  const { audio, setAudio } = useAudioStore();
  const {
    audioPlayer,
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    onValueChange,
  } = useAudioPlayer(audio, setAudio);
  return (
    <div className="bg-background border rounded-sm w-full p-1 overflow-hidden">
      <audio ref={audioPlayer} src={src} preload="metadata" />
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          disabled={!src}
        >
          {isPlaying ? (
            <Pause size={20} className="text-primary" />
          ) : (
            <Play size={20} className="text-primary" />
          )}
        </Button>
        <div className=" flex flex-col gap-1 justify-between w-full h-full">
          <Slider
            className="px-2"
            defaultValue={[currentTime]}
            max={duration}
            step={1}
            value={[currentTime]}
            disabled={!src}
            onValueChange={onValueChange}
            showThumb={false}
          />
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-sm px-1">{calculateTime(currentTime)}</span>
            <span className="text-sm px-1 text-end">
              {isNaN(duration) ? "0:00" : calculateTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayerHpSm;
