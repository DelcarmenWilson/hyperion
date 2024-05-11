import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MessageProps {
  conversationId: string;
  message: string;
  count: number;
}

export const Message = ({ conversationId, message, count }: MessageProps) => {
  const router = useRouter();
  return (
    <div className="max-w-[500px] relative overflow-hidden pt-2">
      {count > 0 && <Badge className="absolute top-0 right-0">{count}</Badge>}
      <Button
        className="truncate overflow-hidden"
        variant="ghost"
        onClick={() => router.push(`/inbox/${conversationId}`)}
      >
        {message}
      </Button>
    </div>
  );
};
