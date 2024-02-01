"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
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
