"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useCurrentRole } from "@/hooks/user/use-current";

type AudioPlayerProps = {
  className?: string;
  src: string | undefined;
  autoPlay?: boolean;
  size?: number;
  disabled?: boolean;
  onListened?: () => void;
};

export const AudioPlayer = ({
  className,
  src,
  autoPlay = false,
  size = 16,
  disabled = false,
  onListened,
}: AudioPlayerProps) => {
  const role = useCurrentRole();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const onPlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      audioRef.current.onended = (ev) => {
        setPlaying(false);
        if (onListened) {
          onListened();
        }
      };
    }
    setPlaying((state) => !state);
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (!src || src == "N/A" || disabled) return;
    onPlayPause();
  }, [src, disabled]);

  useEffect(() => {
    audioRef?.current?.pause;
    setPlaying(false);
  }, [src]);
  if (role == "ASSISTANT") return null;
  return (
    <div className={className}>
      <audio ref={audioRef} src={src} />
      <Button
        size={size > 16 ? "lg" : "default"}
        onClick={onPlayPause}
        disabled={!src || disabled}
        type="button"
      >
        {playing ? <Pause size={size} /> : <Play size={size} />}
      </Button>
    </div>
  );
};
