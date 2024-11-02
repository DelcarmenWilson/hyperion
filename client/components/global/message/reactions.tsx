import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/user/use-current";
import { ChatMessageReaction } from "@prisma/client";

import EmojiPopover from "@/components/custom/emoji-popover";
import Hint from "@/components/custom/hint";

type Props = {
  reactions: ChatMessageReaction[];
  onChange: (name: string, value: string) => void;
};
export const Reactions = ({ reactions, onChange }: Props) => {
  const user = useCurrentUser();
  if (reactions.length == 0) return null;
  return (
    <div className="flex gap-1 items-center my-1">
      {reactions.map((reaction) => (
        <Hint
          key={reaction.id}
          label={`1 person reacted with ${reaction.value}`}
        >
          <button
            className={cn(
              "flex items-center gap-x-1 h6 px-2 rounded-full bg-background border border-transparent text-slate-800",
              reaction.userId == user?.id && "border-primary text-white"
            )}
            onClick={() => onChange(reaction.name, reaction.value)}
          >
            <span className="text-sm">{reaction.value}</span>
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.userId == user?.id && "text-primary"
              )}
            >
              1
            </span>
          </button>
        </Hint>
      ))}

      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.id, emoji.native)}
      >
        <button className="flex items-center h-5 px-2 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800">
          <SmilePlus size={15} />
        </button>
      </EmojiPopover>
    </div>
  );
};
