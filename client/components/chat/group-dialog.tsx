import { useContext, useState } from "react";
import { toast } from "sonner";
import SocketContext from "@/providers/socket";
import { CustomDialog } from "../global/custom-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const GroupDialog = ({ isOpen, onClose }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const [message, setMessage] = useState("");
  const onSubmit = () => {
    socket?.emit("group-message-sent", message);
    setMessage("");
    onClose();
    toast.success("group message sent");
  };
  return (
    <CustomDialog
      title="Group Message"
      description="Group Message"
      open={isOpen}
      onClose={onClose}
    >
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
    </CustomDialog>
  );
};
