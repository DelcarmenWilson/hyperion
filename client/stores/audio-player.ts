import { RefObject} from "react";
import { create } from "zustand";

type State = {
  audio?: RefObject<HTMLAudioElement>;
};
type Actions = {
    setAudio: (e: RefObject<HTMLAudioElement>) => void;
  };
export const useAudioStore = create<State&Actions>((set) => ({
  setAudio: (e) => set({ audio: e }),
}));