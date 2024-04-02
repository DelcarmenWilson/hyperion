"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";
import styles from "./audioplayer.module.css";

type AudioPlayerHpProps = {
  src: string | undefined;
  onListened?: () => void;
};

export const AudioPlayerHp = ({ src, onListened }: AudioPlayerHpProps) => {
  const role = useCurrentRole();
  // const [playing, setPlaying] = useState(false);
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
  const audioPlayer = useRef<HTMLAudioElement>(null); // reference our audio component
  const progressBar = useRef<HTMLProgressElement>(null); // reference our progress bar
  const animationRef = useRef(0); // reference the animation

  useEffect(() => {
    if (!audioPlayer.current || !progressBar.current) return;
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [
    audioPlayer?.current?.onloadedmetadata,
    audioPlayer?.current?.readyState,
  ]);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    if (!audioPlayer.current || !progressBar.current) return;
    const prevValue = isPlaying;
    console.log(prevValue);
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
    if (!progressBar.current || !audioPlayer.current) return;
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    if (!audioPlayer.current) return;
    const pnum = Number(progressBar?.current?.value);
    audioPlayer.current.currentTime = pnum;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    if (!progressBar.current) return;
    const pnum = progressBar.current.value;
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(pnum / duration) * 100}%`
    );
    setCurrentTime(pnum);
  };

  const backThirty = () => {
    if (!progressBar.current) return;
    const pnum = Number(progressBar.current.value);
    progressBar.current.value = pnum - 30;
    changeRange();
  };

  const forwardThirty = () => {
    if (!progressBar.current) return;
    progressBar.current.value = progressBar.current.value + 30;
    changeRange();
  };

  const onStep = (num: number) => {
    if (!progressBar.current) return;
    progressBar.current.value = progressBar.current.value + num;
    changeRange();
  };
  const reset = () => {
    if (!progressBar.current) return;
    progressBar.current.value = 0;
    setIsPlaying(false);
    changeRange();
  };
  if (role == "ASSISTANT") return null;
  return (
    <div className=" bg-secondary p-2">
      <audio ref={audioPlayer} src={src} preload="metadata" />
      <div className="flex gap-2 items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => onStep(-30)}>
          <SkipBack size={20} /> 30
        </Button>
        <Button
          className="rounded-full p-4"
          onClick={togglePlayPause}
          disabled={!src}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onStep(30)}>
          30 <SkipForward size={20} />
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-between px-2">
        <div>{calculateTime(currentTime)}</div>
        <progress
          className={styles.progressBar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
        <div>{duration && !isNaN(duration) && calculateTime(duration)}</div>
      </div>
    </div>
  );
};
