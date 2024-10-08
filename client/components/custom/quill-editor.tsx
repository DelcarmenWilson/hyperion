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
import { CustomDialog } from "../global/custom-dialog";

import Hint from "@/components/custom/hint";
import EmojiPopover from "./emoji-popover";
import { TemplateList } from "@/app/(pages)/settings/(routes)/config/components/templates/list";

import { replacePreset } from "@/formulas/text";

type EditorValue = {
  image: File | null;
  templateImage: string | null;
  body: Delta;
};

type Props = {
  variant?: "create" | "update";
  onSubmit: ({ image, body, templateImage }: EditorValue) => void;
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
  const { onlineUser } = useOnlineUserData();
  const { lead } = useLeadData();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [templateImage, setTemplateImage] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);
  const templateImageRef = useRef<HTMLInputElement>(null);

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

          // ["bold", "italic", "underline", "strike"], // toggled buttons
          // ["blockquote", "code-block"],
          // ["link", "image", "video", "formula"],

          // [{ header: 1 }, { header: 2 }], // custom button values
          // [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          // [{ script: "sub" }, { script: "super" }], // superscript/subscript
          // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          // [{ direction: "rtl" }], // text direction

          // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          // [{ font: [] }],
          // [{ align: [] }],

          // ["clean"],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files![0] || null;
                const addTemplateImage = templateImageRef.current?.value!;
                const isEmpty =
                  !addedImage &&
                  !addTemplateImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;
                submitRef.current?.({
                  body: quill.getContents(),
                  image: addedImage,
                  templateImage: addTemplateImage,
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
  const onTemplateSelected = (tp: UserTemplate) => {
    if (tp.attachment) setTemplateImage(tp.attachment);

    if (tp.message) {
      if (!onlineUser || !lead) return;
      const message = replacePreset(tp.message, onlineUser, lead);
      const quill = quillRef.current;
      quill?.insertText(quill?.getSelection()?.index || 0, message);
    }
    setDialogOpen(false);
  };
  return (
    <>
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Templates"
        description="Template Dialog"
      >
        <TemplateList onSelect={onTemplateSelected} />
      </CustomDialog>
      <div className="flex flex-col">
        <input
          type="file"
          accept="image/*"
          ref={imageElementRef}
          className="hidden"
          onChange={(e) => setImage(e.target.files![0])}
        />
        <input
          ref={templateImageRef}
          value={templateImage}
          className="hidden"
          onChange={(e) => setTemplateImage(e.target.value)}
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
          {!!templateImage && (
            <div className="p-2">
              <div className="relative flex items-center justify-center size-[62px] group/image">
                <Hint label="Remove image" side="top" align="end">
                  <Button
                    className="absolute -top-2.5 -right-2.5 hidden group-hover/image:flex rounded-full z-4"
                    size="xxs"
                    type="button"
                    onClick={() => {
                      setTemplateImage("");
                      templateImageRef.current!.value = "";
                    }}
                  >
                    <X size={15} />
                  </Button>
                </Hint>
                <Image
                  className="rounded-xl overflow-hidden border object-cover"
                  src={templateImage}
                  alt="uploaded"
                  fill
                />
              </div>
            </div>
          )}
          <div className="flex p-1">
            <Hint
              label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
            >
              <Button
                disabled={disabled}
                size="icon"
                variant="ghost"
                onClick={toggleToolbar}
                type="button"
              >
                <ALargeSmall size={16} />
              </Button>
            </Hint>
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button
                disabled={disabled}
                size="icon"
                variant="ghost"
                type="button"
              >
                <Smile size={16} />
              </Button>
            </EmojiPopover>
            {variant == "create" && (
              <>
                <Hint label="Templates">
                  <Button
                    disabled={disabled}
                    size="icon"
                    variant="ghost"
                    onClick={() => setDialogOpen(true)}
                  >
                    <LayoutTemplate size={16} />
                  </Button>
                </Hint>
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
              </>
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
                      body: quillRef.current?.getContents()!,
                      image,
                      templateImage: templateImage,
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
                    body: quillRef.current?.getContents()!,
                    image,
                    templateImage: templateImage,
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
              "flex justify-end text-xs text-muted-foreground opacity-0 transistion",
              !isEmpty && "opacity-100"
            )}
          >
            <p>
              <strong>Shift + Return</strong> to add a new line
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuillEditor;
