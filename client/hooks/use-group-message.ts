import { RefObject, useEffect, useRef, useState } from "react";
import { create } from "zustand";

type groupMessageStore = {
  message?: string;
  userName?: string;
  isOpen:boolean
  onOpen: (m: string, u: string) => void;
  onClose: () => void;
};
export const useGroupMessage = create<groupMessageStore>((set) => ({
  isOpen:false,
  onOpen: (m,u) => set({ isOpen:true, message: m,userName:u}),
  onClose: () => set({isOpen:false, message: undefined,userName:undefined }),
}));

