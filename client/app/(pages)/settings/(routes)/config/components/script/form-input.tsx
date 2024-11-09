import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import { useLeadMessageActions } from "@/hooks/lead/use-message";
import { SmsMessageSchemaType } from "@/schemas/message";

const QuillEditor = dynamic(
  () => import("@/components/custom/quill/quill-editor"),
  {
    ssr: false,
  }
);
type Props = {
  placeholder: string;
};
const FormInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);
  const { onMessageInsertSubmit, IsPendingInsertMessage } =
    useLeadMessageActions(() => {});
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
    const message: SmsMessageSchemaType = {
      content: body.ops[0].insert as string,
      type: "sms",
      //@ts-ignore
      images: templateImage,
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

export default FormInput;
