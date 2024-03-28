"use client";
import { useState } from "react";
import axios from "axios";
import { Phone, Search } from "lucide-react";
import { toast } from "sonner";

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

import { states } from "@/constants/states";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import { TwilioNumber } from "@/types/twilio";
import { columns } from "./columns";

export const PurchaseNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<TwilioNumber[]>([]);
  const [option, setOption] = useState("state");
  const [state, setState] = useState("");
  const [areaCode, setAreaCode] = useState("");

  const onSearchNumbers = () => {
    if (option == "state" && !state) {
      toast.error("Please select a State");
      return;
    } else if (option == "area" && (!areaCode || areaCode.length > 3)) {
      toast.error("3 digits rquired for the area code!");
      return;
    }
    axios
      .post("/api/twilio/phonenumber/list", {
        option: option,
        state: state,
        areaCode: areaCode,
      })
      .then((response) => {
        let phoneNumbers: TwilioNumber[] = response.data;
        if (!phoneNumbers) {
          toast.error("No phone Numbers found");
          return;
        }

        phoneNumbers.forEach((phone) => {
          phone.onPurchase = () => onPrePurchase(phone.phoneNumber);
        });

        setPhoneNumbers(phoneNumbers);
      });
  };

  const onPrePurchase = (e: string) => {
    console.log(e);
  };
  return (
    <CardLayout title="Purchase Phone Numbers" icon={Phone}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        <div className="flex flex-col gap-1 px-2 border-r">
          <span className="text-sm text-muted-foreground">Search by</span>
          <RadioGroup
            defaultValue="state"
            onValueChange={setOption}
            className="grid-cols-2 w-fit"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="state" id="rdoState" />
              <Label htmlFor="rdoState">State</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="area" id="rdoArea" />
              <Label htmlFor="rdoArea">Area code</Label>
            </div>
          </RadioGroup>
          {option == "state" ? (
            <div>
              <p className="text-primary font-bold text-right uppercase">
                Select all States
              </p>
              <Select
                name="ddlState"
                onValueChange={(value) => setState(value)}
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
            </div>
          ) : (
            <Input
              className="mt-2"
              placeholder="area code"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            />
          )}
          <Button className="mt-2 self-end" onClick={onSearchNumbers}>
            Search
          </Button>
        </div>
        <div className="col-span-2 gap-2">
          <h4 className="font-bold text-primary">Phone numbers list</h4>
          {phoneNumbers.length ? (
            <DataTable columns={columns} data={phoneNumbers} headers />
          ) : (
            <p className="flex items-center justify-center gap-2 text-3xl">
              <Search /> Search Phone Numbers
            </p>
          )}
        </div>
      </div>
    </CardLayout>
  );
};
