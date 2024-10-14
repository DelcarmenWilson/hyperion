import dynamic from "next/dynamic";
import { useRef, useState } from "react";
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
  const editorRef = useRef<Quill | null>(null);

  const [key, setKey] = useState(0);
  const { chatId } = useChatStore();
  const user = useCurrentUser();
  const { onChatMessageInsert, chatMessageInsertIsPending } = useChatActions(
    chatId!
  );
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
  return (
    <div className="px-2 w-full">
      <QuillEditor
        key={key}
        placeholder={placeholder}
        onSubmit={handleSumbit}
        disabled={chatMessageInsertIsPending}
        innerRef={editorRef}
      />
    </div>
  );
};
