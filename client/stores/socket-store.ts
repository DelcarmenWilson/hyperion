import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Socket } from "socket.io-client";

type State = {
  socket: Socket|undefined;    
  onSetSocket: (s:Socket) => void;
};

export const useSocketStore = create<State >()(
  immer((set) => ({
    socket:undefined,
    onSetSocket: (s) => set({ socket: s })  
  }))
);