import { Delta } from "quill/core";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Script } from "@prisma/client";

type State = {
  script?: Script;
  content?: Delta;
  newContent: string | undefined;
};

type Actions = {
  setScript: (s: Script) => void;
  setContent: (c: Delta) => void;
  setNewContent: (n: string | undefined) => void;
};

export const useScriptStore = create<State & Actions>()(
  immer((set) => ({
    newContent: undefined,
    setScript: (s) =>
      set({
        script: s,
        content: s.content ? JSON.parse(s.content) : undefined,
      }),
    setContent: (c) => set({ content: c }),
    setNewContent: (n) => set({ newContent: n }),
  }))
);
