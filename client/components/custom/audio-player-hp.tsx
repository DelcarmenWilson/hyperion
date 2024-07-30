"use client";
import { useEffect, useRef, useState } from "react";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateTime } from "@/formulas/dates";

type AudioPlayerHpProps = {
  src: string | undefined;
  onListened?: () => void;
};

export const AudioPlayerHp = ({ src, onListened }: AudioPlayerHpProps) => {
  const role = useCurrentRole();
  // const audioRef = useRef<HTMLAudioElement>(null);
  // const onPlayPause = () => {
  //   if (!audioRef.current) return;
  //   if (playing) {
  //     audioRef.current.pause();
  //   } else {
  //     audioRef.current.play();
  //     audioRef.current.onended = (ev) => {
  //       setPlaying(false);
  //       if (onListened) {
  //         onListened();
  //       }
  //     };
  //   }
  //   setPlaying((state) => !state);
  // };
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const animationRef = useRef(0);

  const togglePlayPause = () => {
    if (!audioPlayer.current) return;
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      audioPlayer.current.onended = (ev) => {
        reset();
        if (onListened) {
          onListened();
        }
      };
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer?.current?.pause();
      cancelAnimationFrame(animationRef?.current);
    }
  };

  const whilePlaying = () => {
    if (!audioPlayer.current) return;
    setCurrentTime(audioPlayer.current.currentTime);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const onValueChange = (e: number[]) => {
    if (!audioPlayer.current) return;
    const val = e[0];
    audioPlayer.current.currentTime = val;
    setCurrentTime(val);
  };

  const onStep = (num: number) => {
    let time = currentTime + num;
    if (time > duration) time = duration - 2;
    else if (time < 0) time = 0;
    onValueChange([time]);
  };

  const reset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioPlayer.current) return;
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
  }, [
    audioPlayer?.current?.onloadedmetadata,
    audioPlayer?.current?.readyState,
  ]);
  if (role == "ASSISTANT") return null;
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
