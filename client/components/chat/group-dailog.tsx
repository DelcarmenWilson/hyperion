import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const GroupDailog = ({ isOpen, onClose }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const [message, setMessage] = useState("");
  const onSubmit = () => {
    socket?.emit("group-message-sent", message);
    setMessage("");
    onClose();
    toast.success("group message sent");
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription className="hidden">
        Group Message Form
      </DialogDescription>
      <DialogContent className="flex flex-col justify-start max-h-[75%] w-full ">
        <h3 className="text-2xl font-semibold py-2">Group Message</h3>
        <div className="h-full overflow-y-auto p-2">
          <Textarea
            value={message}
            placeholder="Type Message"
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <div className="grid grid-cols-2 mt-2 gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!message}>
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
