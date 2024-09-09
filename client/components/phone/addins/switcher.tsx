"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPhoneNumber } from "@/formulas/phones";

type PhoneSwitcherProps = {
  number: string;
  onSetDefaultNumber: (e: string) => void;
  onClose?: () => void;
};

export const PhoneSwitcher = ({
  number,
  onSetDefaultNumber,
  onClose,
}: PhoneSwitcherProps) => {
  const user = useCurrentUser();

  const [selectedNumber, setSelectedNumber] = useState(number);
  const onSelect = (e: string) => {
    setSelectedNumber(e);
    // if (!onClose) {
    //   onSetDefaultNumber(e);
    // }
  };
  return (
    <>
      <Select
        name="ddlPhonenNumbers"
        defaultValue={selectedNumber}
        onValueChange={(e) => onSelect(e)}
      >
        <SelectTrigger className="w-max">
          <SelectValue placeholder="Smart local Id" />
        </SelectTrigger>
        <SelectContent>
          {user?.phoneNumbers.map((phone) => (
            <SelectItem key={phone.phone} value={phone.phone}>
              {formatPhoneNumber(phone.phone)} | {phone.state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onClose && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            <X size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSetDefaultNumber(selectedNumber)}
          >
            <Check size={16} />
          </Button>
        </>
      )}
    </>
  );
};
