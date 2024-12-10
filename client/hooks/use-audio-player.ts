import { RefObject, useEffect, useRef, useState } from "react";

export const useAudioPlayer = (
  audio: RefObject<HTMLAudioElement> | undefined,
  setAudio: (e: RefObject<HTMLAudioElement>) => void,
  onListened?: () => void
) => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const animationRef = useRef(0);

  const togglePlayPause = () => {
    if (!audioPlayer.current) return;
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
     audio?.current?.pause();
      setAudio(audioPlayer);
      audioPlayer.current.play();
      audioPlayer.current.onended = (ev) => {
        onReset();
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

  const onReset = () => {
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

  return {
    audioPlayer,
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    onValueChange,
    onStep,
  };
};