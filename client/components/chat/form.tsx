import dynamic from "next/dynamic";
import { useChatFormActions } from "@/hooks/use-chat";

const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});
type Props = {
  placeholder: string;
};
export const ChatForm = ({ placeholder }: Props) => {
  const {
    agent,
    key,
    handleSumbit,
    chatMessageInserting,
    editorRef,
    typing,
    onTyping,
  } = useChatFormActions();

  return (
    <div className="relative w-full">
      <QuillEditor
        key={key}
        placeholder={placeholder}
        onSubmit={handleSumbit}
        disabled={chatMessageInserting}
        innerRef={editorRef}
        onTyping={onTyping}
      />
      {typing && (
        <p className="absolute bottom-0 left-0 italic text-sm text-muted-foreground">{`${agent?.firstName} is typing`}</p>
      )}
    </div>
  );
};
