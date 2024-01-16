import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: string;
  username: string;
  date: string;
  position: "justify-start" | "justify-end";
}

export const Message = ({
  message,
  username,
  date,
  position,
}: MessageProps) => {
  return (
    <div className={cn("flex w-full", position)}>
      <Card className="flex flex-col mb-2 max-w-[300px]">
        <CardContent>
          <p className="text-muted-foreground text-sm text-right">{date}</p>
          <p>{message}</p>
          <div className="flex justify-end">
            <Badge>{username}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
