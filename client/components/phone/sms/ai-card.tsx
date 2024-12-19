import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";

type AiCardProps = {
  id: string;
  body: string;
  createdAt: Date;
};

export const AiCard = ({ id, body, createdAt }: AiCardProps) => {
  return (
    <div className="relative bg-gradient text-sm w-full p-1 rounded mb-1">
      <div className="flex flex-col gap-1 bg-background/75 py-2 px-3 rounded">
        <p className="flex justify-between items-center text-muted-foreground">
          <span>Titan suggestion</span>
          <span className="text-xs italic">
            {formatDistance(createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
        </p>
        <span className="text-wrap  break-words">{body}</span>
        <div className="flex justify-end gap-2">
          <Button className="gap-2">
            <ThumbsUp size={15} /> Accept
          </Button>

          <Button className="gap-2" variant="outlineprimary">
            <ThumbsDown size={15} /> Reject
          </Button>
        </div>
      </div>
    </div>
  );
};
