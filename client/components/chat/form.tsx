import dynamic from "next/dynamic";
import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "@/providers/socket";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import { useChatStore, useChatActions } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-current-user";

import { ChatMessageSchemaType } from "@/schemas/chat";

const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});
type Props = {
  placeholder: string;
};
export const ChatForm = ({ placeholder }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const editorRef = useRef<Quill | null>(null);

  const [key, setKey] = useState(0);
  const { chatId, user: agent } = useChatStore();
  const user = useCurrentUser();
  const { onChatMessageInsert, chatMessageInsertIsPending } = useChatActions(
    chatId!
  );
  const [typing, setTyping] = useState(false);

  const onTyping = () => {
    socket?.emit("chat-is-typing-sent", agent?.id);
  };

  const handleSumbit = ({
    body,
    image,
    templateImage,
  }: {
    body: Delta;
    image: File | null;
    templateImage: string | null;
  }) => {
    const message: ChatMessageSchemaType = {
      content: body.ops[0].insert as string,
      //@ts-ignore
      attachment: templateImage,
      chatId,
      senderId: user?.id!,
    };
    onChatMessageInsert(message);
    setKey((prev) => prev + 1);
  };
  useEffect(() => {
    const recieveTyping = () => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    };
    socket?.on("chat-is-typing-received", (data) => {
      recieveTyping();
    });
  }, []);
  return (
    <div className="relative px-2 w-full">
      <QuillEditor
        key={key}
        placeholder={placeholder}
        onSubmit={handleSumbit}
        disabled={chatMessageInsertIsPending}
        innerRef={editorRef}
        onTyping={onTyping}
      />
      {typing && (
        <p className="absolute bottom-0 left-0 italic text-sm text-muted-foreground">{`${agent?.firstName} is typing`}</p>
      )}
    </div>
  );
};
