"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./toolbar";
import { ScrollArea } from "../ui/scroll-area";

type TiptapProps = {
  description: string;
  onChange: (richText: string) => void;
};
export const Tiptap = ({ description, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md border w-ful min-h-[250px] h-full border-input bg-background ring-offset-2 p-2 disabled:cursor-not-allowed disabled:opacity-50 over-flow",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-1 flex-col justify-stretch min-h-[250px] overflow-hidden">
      <Toolbar editor={editor} />
      <ScrollArea>
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
};
