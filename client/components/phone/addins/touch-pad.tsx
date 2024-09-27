"use client";

import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";

import { Button } from "@/components/ui/button";
import { NotesForm } from "@/components/lead/forms/notes-form";

import { touchPadNumbers } from "@/constants/touch-pad-numbers";

type TouchPadProps = {
  onNumberClick: (num: string) => void;
  btnHeight?: string;
  displayScript?: boolean;
  disabled?: boolean;
};
export const TouchPad = ({
  onNumberClick,
  btnHeight = "full",
  displayScript = true,
  disabled = false,
}: TouchPadProps) => {
  const { showScript } = usePhoneStore();
  return (
    <div className="relative">
      {displayScript && (
        <div
          className={cn(
            "absolute bg-background -top-[102%] left-0 w-full h-full p-1 transition-[top] ease-in-out duration-100",
            showScript && "top-0"
          )}
        >
          <NotesForm showShared={false} rows={9} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-1">
        {touchPadNumbers.map((number) => (
          <Button
            key={number.value}
            className={cn(
              "flex-col gap-1",
              btnHeight == "full" ? "h-14" : "h-9"
            )}
            variant="outlineprimary"
            disabled={disabled}
            onClick={() => onNumberClick(number.value)}
            type="button"
          >
            <p className={cn(btnHeight == "full" ? "text-2xl" : " text-lg")}>
              {number.value}
            </p>
            {btnHeight == "full" && <p className="text-xs">{number.letters}</p>}
          </Button>
        ))}
      </div>
    </div>
  );
};
