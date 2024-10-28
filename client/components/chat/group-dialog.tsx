import { useContext, useState } from "react";
import { useChatStore } from "@/hooks/use-chat";
import SocketContext from "@/providers/socket";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CustomDialog } from "../global/custom-dialog";
import { Textarea } from "@/components/ui/textarea";

export const GroupDialog = () => {
  const { isGroupDialogOpen, onGroupDialogClose } = useChatStore();
  const { socket } = useContext(SocketContext).SocketState;
  const [message, setMessage] = useState("");
  const onSubmit = () => {
    socket?.emit("group-message-sent", message);
    setMessage("");
    onGroupDialogClose();
    toast.success("group message sent");
  };
  return (
    <CustomDialog
      title="Group Message"
      description="Group Message"
      open={isGroupDialogOpen}
      onClose={onGroupDialogClose}
    >
      <div className="h-full overflow-y-auto p-2">
        <Textarea
          value={message}
          placeholder="Type Message"
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
        <div className="grid grid-cols-2 mt-2 gap-2">
          <Button variant="outline" onClick={onGroupDialogClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!message}>
            Send
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};
