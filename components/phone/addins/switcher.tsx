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
  controls?: boolean;
  onSetDefaultNumber: (e: string) => void;
};

export const PhoneSwitcher = ({
  number,
  controls,
  onSetDefaultNumber,
}: PhoneSwitcherProps) => {
  const user = useCurrentUser();

  const [selectedNumber, setSelectedNumber] = useState(number);
  const onSelect = (e: string) => {
    setSelectedNumber(e);
    if (!controls) {
      onSetDefaultNumber(e);
    }
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
      {controls && (
        <>
          <Button
            variant="link"
            size="sm"
            onClick={() => onSetDefaultNumber(selectedNumber)}
          >
            <X size={16} />
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => onSetDefaultNumber(selectedNumber)}
          >
            <Check size={16} />
          </Button>
        </>
      )}
    </>
  );
};
