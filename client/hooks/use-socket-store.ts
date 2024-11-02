import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Socket } from "socket.io-client";

type State = {
  socket: Socket|undefined;  
};

type Actions = {
  onSetSocket: (s:Socket) => void;
};

export const useSocketStore = create<State & Actions>()(
  immer((set) => ({
    socket:undefined,
    onSetSocket: (s) => set({ socket: s })  
  }))
);