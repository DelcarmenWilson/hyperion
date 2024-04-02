"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";

type AudioPlayerHpProps = {
  src: string | undefined;
  onListened?: () => void;
};

export const AudioPlayerHp = ({ src, onListened }: AudioPlayerHpProps) => {
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
  if (role == "ASSISTANT") return null;
  return (
    <div className=" bg-secondary p-2">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex gap-2 items-center justify-between">
        <Button variant="ghost" size="sm">
          <SkipBack size={20} /> 30
        </Button>
        <Button
          className="rounded-full p-4"
          onClick={onPlayPause}
          disabled={!src}
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="ghost" size="sm">
          30 <SkipForward size={20} />
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-between px-2">
        <div>0:00</div>
        <input type="range" />
        <div>2:49</div>
      </div>
    </div>
  );
};
