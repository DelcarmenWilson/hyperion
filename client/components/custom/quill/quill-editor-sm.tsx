import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ALargeSmall,
  ImageIcon,
  LayoutTemplate,
  Send,
  Smile,
  X,
} from "lucide-react";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLeadData } from "@/hooks/lead/use-lead";
import { useOnlineUserData } from "@/hooks/user/use-user";

import { UserTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "../../global/custom-dialog";

import Hint from "@/components/custom/hint";
import EmojiPopover from "../emoji-popover";
import { TemplateList } from "@/app/(pages)/settings/(routes)/config/components/templates/list";

import { replacePreset } from "@/formulas/text";

type EditorValue = {
  body: Delta;
};

type Props = {
  onSubmit: ({ body }: EditorValue) => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  onTyping?: () => void;
};

const QuillEditorSm = ({
  onSubmit,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  onTyping,
}: Props) => {
  const [text, setText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

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
                const isEmpty =
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;
                submitRef.current?.({
                  body: quill.getContents(),
                });
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

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }

    return () => {
      if (container) container.innerHTML = "";
      quill.off(Quill.events.TEXT_CHANGE);
      if (quillRef.current) quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, [innerRef]);

  useEffect(() => {
    if (text.length == 0) return;
    if (onTyping) onTyping();
  }, [text]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 p-1 items-center">
        <div className="flex-1 border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-background">
          <div
            ref={containerRef}
            className="h-full ql-custom !text-foreground"
          />
        </div>
        <Button
          className="ml-auto"
          disabled={disabled || isEmpty}
          size="icon"
          onClick={() => {
            onSubmit({
              body: quillRef.current?.getContents()!,
            });
          }}
        >
          <Send size={16} />
        </Button>
      </div>

      <div
        className={cn(
          "px-1 text-xs text-muted-foreground opacity-0 transistion",
          !isEmpty && "opacity-100"
        )}
      >
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default QuillEditorSm;
