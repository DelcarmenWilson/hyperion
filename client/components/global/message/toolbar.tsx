import EmojiPopover from "@/components/custom/emoji-popover";
import Hint from "@/components/custom/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquareQuote, Pencil, Smile, Trash } from "lucide-react";
import React from "react";

type Props = {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleReaction: (id: string, value: string) => void;
};
export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleReaction,
}: Props) => {
  return (
    <div className={cn("absolute top-0", isAuthor ? "left-5" : "right-5")}>
      <div className="opacity-0 transition-opacity border bg-background rounded-md shadow-sm group-hover:opacity-100">
        <EmojiPopover
          hint="Add reaction"
          // onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          onEmojiSelect={(emoji) => handleReaction(emoji.id, emoji.native)}
        >
          <Button variant="ghost" size="xs" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {/* {!hideThreadButton&&( <Hint label="Reply in thread">
        <Button variant="ghost" size="xs" disabled={isPending}>
          <MessageSquareQuote className="size-4" />
        </Button>
        </Hint>)} */}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant="ghost"
                size="xs"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>

            <Hint label="Delete message">
              <Button
                variant="ghost"
                size="xs"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
