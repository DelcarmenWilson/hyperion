"use client";
import { useState } from "react";
import { Check, HelpCircle, Phone } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { isAValidPhoneNumber } from "@/formulas/phones";
import { phoneNumberInsert } from "@/actions/phone";
import { states } from "@/constants/states";

export const PurchasePhoneNumbers = () => {
  const [stateSelected, setStateSelected] = useState("");
  const [numberSelected, setNumberSelected] = useState("");
  const items: string[] = [
    "Does local id work automatically?",
    "Can I get multilple numbers in the same state for the area code matching?",
    "Can I change the caller ID number for a lead anytime?",
    "Can I get multilple numbers in states all over the country?",
    "Can I monitor the spam rate and deliverability of my numbers?",
    "If I dont have a number in a particular state, will my default number be used?",
    "Can I dedicate 1 number for calling and the rest for texting?",
  ];

  const onPurchaseNumber = () => {
    if (!stateSelected) {
      toast.error("Please select a State");
      return;
    }

    if (numberSelected.length < 10) {
      toast.error("10 digits requires ex. 7189892356");
      return;
    }
    if (!isAValidPhoneNumber(numberSelected)) {
      toast.error("Not a valid phone number");
      return;
    }

    phoneNumberInsert(numberSelected, stateSelected).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setStateSelected("");
        setNumberSelected("");
      }
    });
  };
  return (
    <Card className="relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Purchase Phone Numbers
          </CardTitle>
        </div>
      </div>
      <CardContent className="items-center pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Search by</span>
            <RadioGroup defaultValue="option-one" className="grid-cols-2 w-fit">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Sate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Area code</Label>
              </div>
            </RadioGroup>
            <p className="text-primary font-bold text-right uppercase">
              Select all States
            </p>

            <Select
              name="ddlState"
              onValueChange={(value) => setStateSelected(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select States you want phone numbers in" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.abv} value={state.abv}>
                    {state.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Phone number"
              onChange={(e) => setNumberSelected(e.target.value)}
            />
            <Button
              disabled={!numberSelected}
              className="mt-4 self-end"
              onClick={onPurchaseNumber}
            >
              Purchase
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary">Yes you can</h4>
            <div className="flex flex-col gap-1 font-light text-sm">
              {items.map((item, i) => (
                <Item key={i} text={item} />
              ))}
            </div>
            <span className="flex items-center gap-2 font-bold text-primary">
              <HelpCircle className="w-4 h-4" />
              Looking for even more information about phone numbers in Hyperion?
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type TxtProps = {
  text: string;
};

export const Item = ({ text }: TxtProps) => {
  return (
    <span className="flex items-center gap-2">
      <Check className="w-4 h-4" />
      {text}
    </span>
  );
};
