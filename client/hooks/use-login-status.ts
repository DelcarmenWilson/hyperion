import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";

import { LoginStatus } from "@prisma/client";
import { OnlineUser } from "@/types/user";

import { getLoginStatusForUser } from "@/actions/login-status";

type useLoginStatusStore = {
  user?: OnlineUser;
  isLoginStatusOpen: boolean;
  onLoginStatusOpen: (u?: OnlineUser) => void;
  onLoginStatusClose: () => void;
};

export const useLoginStatus = create<useLoginStatusStore>((set) => ({
  isLoginStatusOpen: false,
  onLoginStatusOpen: (u?) => set({ user: u, isLoginStatusOpen: true }),
  onLoginStatusClose: () => set({ isLoginStatusOpen: false }),
}));

export const useLoginStatusData = (userId: string) => {
  //DEFAULT NODES
  const onGetLoginsForUser = () => {
    const { data: logins, isFetching: loginsFetching } = useQuery<
      LoginStatus[]
    >({
      queryKey: [`agent-logins-${userId}`],
      queryFn: () => getLoginStatusForUser(userId),
      enabled:!!userId
    });

    return { logins, loginsFetching };
  };

  return {
     onGetLoginsForUser,
  };
};
