"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";

type AudioPlayerProps = {
  src: string | undefined;
  autoPlay?: boolean;
  onListened?: () => void;
};

export const AudioPlayer = ({
  src,
  autoPlay = false,
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
      <Button onClick={onPlayPause} disabled={!src} type="button">
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </Button>
    </div>
  );
};
