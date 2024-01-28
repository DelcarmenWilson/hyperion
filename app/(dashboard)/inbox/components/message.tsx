import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MessageProps {
  conversationId: string;
  message: string;
}

export const Message = ({ conversationId, message }: MessageProps) => {
  const router = useRouter();
  return (
    <div className="max-w-[500px]">
      <Button
        variant="ghost"
        onClick={() => router.push(`/inbox/${conversationId}`)}
      >
        {message}
      </Button>
    </div>
  );
};
