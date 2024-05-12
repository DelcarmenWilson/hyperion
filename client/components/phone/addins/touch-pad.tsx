"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { touchPadNumbers } from "@/constants/touch-pad-numbers";

type TouchPadProps = {
  onNumberClick: (num: string) => void;
};
export const TouchPad = ({ onNumberClick }: TouchPadProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {touchPadNumbers.map((number) => (
        <Button
          key={number.value}
          className="flex-col gap-1 h-14"
          variant="outlineprimary"
          onClick={() => onNumberClick(number.value)}
        >
          <p>{number.value}</p>
          <p>{number.letters}</p>
        </Button>
      ))}
    </div>
  );
};
