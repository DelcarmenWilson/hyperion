"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TwilioApps } from "@/constants/twilio";

type Props = {
  app: string | undefined;
  setApp: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
};

export const TwilioAppSelect = ({ app, setApp, disabled = false }: Props) => {
  return (
    <Select
      name="ddlApps"
      disabled={disabled}
      defaultValue={app}
      onValueChange={setApp}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an app" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {TwilioApps?.map((app) => (
          <SelectItem key={app.value} value={app.value}>
            {app.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
