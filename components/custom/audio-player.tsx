"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

type AudioPlayerProps = {
  src: string;
  onListened?: () => void;
};

export const AudioPlayer = ({ src, onListened }: AudioPlayerProps) => {
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
  return (
    <div>
      <audio ref={audioRef} src={src} />
      <Button onClick={onPlayPause} disabled={!src}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  );
};
