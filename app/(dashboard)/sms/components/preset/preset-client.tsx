import { ScrollArea } from "@/components/ui/scroll-area";
import { FollowUp } from "./folow-up";
import { Text } from "./text";
import { WhileAway } from "./while-away";
import { Birthday } from "./birthday";
import { Reminder } from "./reminder";
import { presetsGetAllByAgentId } from "@/data/preset";
import { currentUser } from "@/lib/auth";

export const PresetClient = async () => {
  const user = await currentUser();
  const presets = await presetsGetAllByAgentId(user?.id!);
  return (
    <ScrollArea className="flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
        <div className="flex flex-col gap-4">
          <Text presets={presets} />
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
