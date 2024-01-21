import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertCircle, Phone, X } from "lucide-react";
import { Switch } from "../ui/switch";
import { numbers } from "@/constants/phone-numbers";

export const Dialer = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disabled, setDisabled] = useState(false);
  // const numbers = [
  //   {
  //     value: "1",
  //     letters: "",
  //   },
  //   {
  //     value: "2",
  //     letters: "ABC",
  //   },
  //   {
  //     value: "3",
  //     letters: "EFG",
  //   },
  //   {
  //     value: "4",
  //     letters: "GHI",
  //   },
  //   {
  //     value: "5",
  //     letters: "JKL",
  //   },
  //   {
  //     value: "6",
  //     letters: "MNO",
  //   },
  //   {
  //     value: "7",
  //     letters: "PQRS",
  //   },
  //   {
  //     value: "8",
  //     letters: "TUV",
  //   },
  //   {
  //     value: "9",
  //     letters: "WXYZ",
  //   },
  //   {
  //     value: "*",
  //     letters: "",
  //   },
  //   {
  //     value: "0",
  //     letters: "",
  //   },
  //   {
  //     value: "#",
  //     letters: " ",
  //   },
  // ];

  const onClick = (num: string) => {
    setPhoneNumber((state) => (state += num));
    if (phoneNumber.length > 9) {
      setDisabled(true);
    }
  };

  const onReset = () => {
    setPhoneNumber("");
    setDisabled(false);
  };
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="relative">
        <Input placeholder="Phone Number" value={phoneNumber} />
        <X
          className="h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer"
          onClick={onReset}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="w-40">Caller Id</span>
        <Input placeholder="Smart local Id" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 text-sm">
          <AlertCircle className="h-4 w-4" /> Call recording
        </div>
        <div className="flex gap-2">
          Off <Switch /> On
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 text-sm">
          <AlertCircle className="h-4 w-4" /> Agent coaching
        </div>
        <div className="flex gap-2">
          Off <Switch /> On
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {numbers.map((number) => (
          <Button
            key={number.value}
            disabled={disabled}
            className="flex-col gap-1 h-14"
            variant="outlineprimary"
            onClick={() => onClick(number.value)}
          >
            <p>{number.value}</p>
            <p>{number.letters}</p>
          </Button>
        ))}
      </div>
      <Button disabled={!disabled}>
        <Phone className="h-4 w-4 mr-2" /> Call
      </Button>
    </div>
  );
};
