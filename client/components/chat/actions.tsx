import React, { useState } from "react";
import { AlertModal } from "../modals/alert";
import { useChatActions } from "@/hooks/chat/use-chat";
import { Button } from "../ui/button";

export const ChatActions = () => {
  const { onChatDelete, chatDeleting } = useChatActions();
  const [alertOpen, setAlertOpen] = useState(false);
  const onHandleChatDelete = () => {
    onChatDelete();
    setAlertOpen(false);
  };
  return (
    <>
      <AlertModal
        title="Want to delete this chat"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onHandleChatDelete}
        loading={chatDeleting}
        height="h-200"
      />

      <Button
        variant="destructive"
        onClick={() => {
          setAlertOpen(true);
        }}
        disabled={chatDeleting}
      >
        Delete Chat
      </Button>
    </>
  );
};
