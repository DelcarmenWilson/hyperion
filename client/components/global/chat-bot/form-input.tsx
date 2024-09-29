import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import { usePublicChatBotActions } from "./hooks/use-chatbot";
import { SmsMessageSchemaType } from "@/schemas/message";
import { PublicChatbotMessageSchemaType } from "@/schemas/chat-bot/publicchatbot";

const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});
type Props = {
  placeholder: string;
};
const ChatBotFormInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);
  const { onMessageInsertSubmit, IsPendingInsertMessage } =
    usePublicChatBotActions();

  const [key, setKey] = useState(0);

  const handleSumbit = ({
    body,
    image,
    templateImage,
  }: {
    body: Delta;
    image: File | null;
    templateImage: string | null;
  }) => {
    const message: PublicChatbotMessageSchemaType = {
      conversationId: "",
      role: "user",
      content: body.ops[0].insert as string,
    };
    onMessageInsertSubmit(message);
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

export default ChatBotFormInput;
