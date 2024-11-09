"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import { Delta } from "quill/core";
import { useLeadMessageActions } from "@/hooks/lead/use-message";
import QuillEditorFull from "@/components/custom/quill/quill-editor-full";
import { useScriptStore } from "../hooks/use-script-store";

const ScriptEditor = () => {
  const editorRef = useRef<Quill | null>(null);
  const { onMessageInsertSubmit, IsPendingInsertMessage } =
    useLeadMessageActions(() => {});
  const { content, setContent, newContent, setNewContent } = useScriptStore();

  useEffect(() => {
    if (!editorRef.current) return;
    const quill = editorRef.current;
    quill.root.addEventListener("blur", function () {
      const text = quill.getContents();
      setContent(text);
    });
    return () => {
      if (!editorRef.current) return;
      //TODO - need to find a way to send the actual event
      editorRef.current.root.removeEventListener("blur", () => {});
      editorRef.current = null;
    };
  }, [editorRef]);

  useEffect(() => {
    if (!newContent) return;
    const quill = editorRef.current!;
    // quill.insertText(quill.getSelection()?.index || 0, newContent);
    //TODO - need to work on this a bit more
    quill.insertText(
      quill.getSelection(false)?.index || quill.getLength() - 1,
      newContent
    );
    setNewContent(newContent);
  }, [newContent]);

  useEffect(() => {
    if (!content) return;
    const quill = editorRef.current!;
    quill.setContents(content);
  }, [content]);

  return (
    <main className="container h-full w-full">
      <div className="w-full h-full bg-background overflow-hidden">
        <QuillEditorFull
          placeholder="Type or paste your script here"
          disabled={IsPendingInsertMessage}
          innerRef={editorRef}
        />
      </div>
    </main>
  );
};

export default ScriptEditor;
