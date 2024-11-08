import { ScrollArea } from "@/components/ui/scroll-area";
import { FollowUp } from "./folow-up";
import { Text } from "./text";
import { WhileAway } from "./while-away";
import { Birthday } from "./birthday";
import { Reminder } from "./reminder";

import { presetsGetAll } from "@/actions/user/preset";

export const PresetClient = async () => {
  const presets = await presetsGetAll();
  return (
    <ScrollArea className="flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
        <div className="flex flex-col gap-4">
          <Text initPresets={presets} />
          <WhileAway />
          <FollowUp />
        </div>

        <div className="flex flex-col gap-4">
          <Birthday />
          <Reminder />
        </div>
      </div>
    </ScrollArea>
  );
};
