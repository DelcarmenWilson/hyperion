"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";

type AudioPlayerProps = {
  src: string | undefined;
  autoPlay?: boolean;
  size?: number;
  onListened?: () => void;
};

export const AudioPlayer = ({
  src,
  autoPlay = false,
  size = 16,
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
    onPlayPause();
  }, [src]);
  if (role == "ASSISTANT") return null;
  return (
    <div>
      <audio ref={audioRef} src={src} />
      <Button
        size={size > 16 ? "lg" : "default"}
        onClick={onPlayPause}
        disabled={!src}
        type="button"
      >
        {playing ? <Pause size={size} /> : <Play size={size} />}
      </Button>
    </div>
  );
};
