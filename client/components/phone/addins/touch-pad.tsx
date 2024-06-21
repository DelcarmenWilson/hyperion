"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { touchPadNumbers } from "@/constants/touch-pad-numbers";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { usePhone } from "@/hooks/use-phone";
import { cn } from "@/lib/utils";

type TouchPadProps = {
  onNumberClick: (num: string) => void;
};
export const TouchPad = ({ onNumberClick }: TouchPadProps) => {
  const { lead, showScript } = usePhone();
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute bg-background -top-[102%] left-0 w-full h-full p-1 transition-[top] ease-in-out duration-100",
          showScript && "top-0"
        )}
      >
        <NotesForm
          leadId={lead?.id as string}
          intialNotes={lead?.notes as string}
          initSharedUser={lead?.sharedUser}
          rows={9}
        />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {touchPadNumbers.map((number) => (
          <Button
            key={number.value}
            className="flex-col gap-1 h-14"
            variant="outlineprimary"
            onClick={() => onNumberClick(number.value)}
          >
            <p className="text-2xl">{number.value}</p>
            <p className="text-xs">{number.letters}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};
