"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TiptapProps = {
  description: string;
  controls?: boolean;
  maxHeight?: string;
  editable?: boolean;
  onChange?: (richText: string) => void;
};
export const Tiptap = ({
  description,
  controls = true,
  maxHeight = "",
  editable = true,
  onChange,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,

    editorProps: {
      attributes: {
        class: editable
          ? "rounded-md border w-full min-h-[250px] h-full border-input bg-background ring-offset-2 p-2"
          : "",
      },
    },
    editable,
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-stretch min-h-[250px] overflow-hidden",
        maxHeight
      )}
    >
      {controls && <Toolbar editor={editor} />}
      <ScrollArea>
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
};
