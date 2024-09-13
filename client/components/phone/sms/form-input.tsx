import dynamic from "next/dynamic";
import { useRef } from "react";
import Quill from "quill";

const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});
type Props = {
  placeholder: string;
};
const FormInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);

  const handleSumbit = ({
    body,
    image,
  }: {
    body: string;
    image: File[] | null;
  }) => {
    console.log(body, image);
  };
  return (
    <div className="px-5 w-full">
      <QuillEditor
        placeholder={placeholder}
        onSubmit={handleSumbit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default FormInput;
