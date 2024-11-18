"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { AudioPlayer } from "@/components/custom/audio-player";
import { Button } from "@/components/ui/button";

import { touchPadNumbers } from "@/constants/touch-pad-numbers";

type TouchPadProps = {
  onNumberClick: (num: string) => void;
  btnHeight?: string;
  dmftPack?: string;
  disabled?: boolean;
};
export const TouchPad = ({
  onNumberClick,
  btnHeight = "full",
  dmftPack = "dial",
  disabled = false,
}: TouchPadProps) => {
  const [dialToneCliked, setDialToneCliked] = useState("");

  return (
    <div className="grid grid-cols-3 gap-1">
      {touchPadNumbers.map((number) => (
        <Button
          key={number.value}
          className={cn("flex-col gap-1", btnHeight == "full" ? "h-14" : "h-9")}
          variant="outlineprimary"
          disabled={disabled}
          onClick={() => {
            setDialToneCliked(number.value);
            onNumberClick(number.value);
          }}
          type="button"
        >
          <p className={cn(btnHeight == "full" ? "text-2xl" : " text-lg")}>
            {number.value}
          </p>
          {btnHeight == "full" && <p className="text-xs">{number.letters}</p>}
        </Button>
      ))}
      <AudioPlayer
        className="hidden"
        autoPlay
        src={`/sounds/dialtone/${dmftPack}-${dialToneCliked}.mp3`}
      />
    </div>
  );
};
