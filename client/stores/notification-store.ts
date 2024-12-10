import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  notificationId?: string;
  notificationIds?: string[];
  isNotificationOpen: boolean;
};
type Actions = {
  onNotificationOpen: (n: string) => void;
  onNotificationClose: (n: string) => void;
};

export const useNotificationStore = create<State & Actions>()(
  immer((set) => ({
    isNotificationOpen: false,
    onNotificationOpen: (n) =>
      set((state) => {
        state.notificationIds?.push(n);
        state.isNotificationOpen = true;
      }),
    onNotificationClose: (n) =>
      set((state) => {
        if (n == "clear") state.notificationIds = [];
        else
          state.notificationIds = state.notificationIds?.filter((e) => e != n);
        if (state.notificationIds?.length == 0)
          state.isNotificationOpen = false;
      }),
  }))
);