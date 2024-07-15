import { loginStatusGetAllByUserId } from "@/actions/login-status";
import { OnlineUser } from "@/types/user";
import { LoginStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

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
  const onloginStatusGetAllByUserId = () => {
    const { data: logins, isFetching: loginsIsFetching } = useQuery<
      LoginStatus[]
    >({
      queryKey: ["agentLogins", `user-${userId}`],
      queryFn: () => loginStatusGetAllByUserId(userId),
    });

    return { logins, loginsIsFetching };
  };

  return {
    onloginStatusGetAllByUserId,
  };
};
