import { useSession } from "next-auth/react";
import { Cog } from "lucide-react";

import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DialerSettingsType } from "@/types";
import { Switch } from "@/components/ui/switch";

import { chatSettingsUpdateRecord } from "@/actions/chat-settings";

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
  const { update } = useSession();

  const onRecordUpdate = () => {
    setSettings((settings) => {
      return { ...settings, record: !settings.record };
    });
    update();
    chatSettingsUpdateRecord(!settings.record).then((data) => {
      if (data.error) toast.success(data.error);
      if (data.success) toast.success(data.success);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline" size="icon">
          <Cog size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-start min-h-[40%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">Dialer Settings</h3>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
          <div className="space-y-0.5">
            <h4 className="font-bold">Recording</h4>
            <h5>Enable Call Recording</h5>
          </div>
          <Switch checked={settings.record} onCheckedChange={onRecordUpdate} />
        </div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
