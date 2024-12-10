import { create } from "zustand";
import { Delta } from "quill/core";
import { immer } from "zustand/middleware/immer";
import { Script } from "@prisma/client";

type State = {
  script?: Script;
  content?: Delta;
  newContent: string | undefined;
  // ADMIN
  scriptId?: string;
};

type Actions = {
  setScript: (s: Script) => void;
  setContent: (c: Delta) => void;
  setNewContent: (n: string | undefined) => void;
// ADMIN
  setScriptId: (s?: string) => void;
  isScriptFormOpen: boolean;
  onScriptFormOpen: (e?: string) => void;
  onScriptFormClose: () => void;
  
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
    // ADMIN
    setScriptId: (a) => set({ scriptId: a }),
  isScriptFormOpen: false,
  onScriptFormOpen: (e) => set({ scriptId: e, isScriptFormOpen: true }),
  onScriptFormClose: () => set({ isScriptFormOpen: false }),
  }))
);
