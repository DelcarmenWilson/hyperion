import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ALargeSmall, ImageIcon, Send, Smile, X } from "lucide-react";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

import { Button } from "@/components/ui/button";
import Hint from "@/components/custom/hint";

import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import EmojiPopover from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

type Props = {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
};

const QuillEditor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
}: Props) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files![0] || null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) innerRef.current = quill;
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => setText(quill.getText()));

    return () => {
      if (container) container.innerHTML = "";
      quill.off(Quill.events.TEXT_CHANGE);
      if (quillRef.current) quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };
  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        className="hidden"
        onChange={(e) => setImage(e.target.files![0])}
      />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative flex items-center justify-center size-[62px] group/image">
              <Hint label="Remove image" side="top" align="end">
                <Button
                  className="absolute -top-2.5 -right-2.5 hidden group-hover/image:flex rounded-full z-4"
                  size="xxs"
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                >
                  <X size={15} />
                </Button>
              </Hint>
              <Image
                className="rounded-xl overflow-hidden border object-cover"
                src={URL.createObjectURL(image)}
                alt="uploaded"
                fill
              />
            </div>
          </div>
        )}
        <div className="flex ">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size="icon"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <ALargeSmall size={16} />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="icon" variant="ghost">
              <Smile size={16} />
            </Button>
          </EmojiPopover>
          {variant == "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="icon"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon size={16} />
              </Button>
            </Hint>
          )}
          {variant == "update" && (
            <div className="flex items-center gap-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
              >
                Save
              </Button>
            </div>
          )}
          {variant == "create" && (
            <Button
              className="ml-auto"
              disabled={disabled || isEmpty}
              size="icon"
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
            >
              <Send size={16} />
            </Button>
          )}
        </div>
      </div>
      {variant == "create" && (
        <div
          className={cn(
            "flex justify-end p-2 text-sm text-muted-foreground opacity-0 transistion",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default QuillEditor;
