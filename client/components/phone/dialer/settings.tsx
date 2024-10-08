"use client";
import { useState } from "react";
import { Cog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { DialerSettingsType } from "@/types";

type DialerSettingsProps = {
  settings: DialerSettingsType;
  setSettings: React.Dispatch<React.SetStateAction<DialerSettingsType>>;
  disabled: boolean;
};

export const DialerSettings = ({
  settings,
  setSettings,
  disabled,
}: DialerSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogDescription className="hidden">
        Dailer Settings Form
      </DialogDescription>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline" size="icon">
          <Cog size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-start min-h-[40%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">Dialer Settings</h3>
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h4 className="font-bold">Dial Matrix</h4>
            <Input
              disabled={disabled}
              value={settings.matrix}
              onChange={(e) =>
                setSettings((settings) => {
                  return { ...settings, matrix: parseInt(e.target.value) };
                })
              }
              type="number"
            />
            <h5 className="text-muted-foreground text-sm">
              amount of calls per lead
            </h5>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold">Pause</h4>
            <Input
              disabled={disabled}
              value={settings.pause}
              onChange={(e) =>
                setSettings((settings) => {
                  return { ...settings, pause: parseInt(e.target.value) };
                })
              }
              type="number"
            />
            <h5 className="text-muted-foreground text-sm">
              puase between calls
            </h5>
          </div>
        </div>

        <Button onClick={() => setIsOpen(false)}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};
