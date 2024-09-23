import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import { useLeadMessageActions } from "@/hooks/lead/use-message";
import { SmsMessageSchemaType } from "@/schemas/message";
import { ChatMessageSchemaType } from "@/schemas/chat";
import { chatMessageInsert } from "@/actions/chat";
import { useChat, useChatActions } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-current-user";

const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});
type Props = {
  placeholder: string;
};
const FormInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);
  const { onMessageInsertSubmit, IsPendingInsertMessage } =
    useLeadMessageActions(() => {});
  const [key, setKey] = useState(0);
  const { chatId } = useChat();
  const user = useCurrentUser();
  const {onChatMessageInsert}=useChatActions(chatId!);
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
        disabled={IsPendingInsertMessage}
        innerRef={editorRef}
      />
    </div>
  );
};

export default FormInput;
