import { useQuery } from "@tanstack/react-query";

import { User } from "@prisma/client";
import { OnlineUser } from "@/types/user";

import { usersGetAllChat } from "@/actions/user";
import { userGetByIdOnline } from "@/actions/user";

export const useOnlineUserData = () => {
  const { data: onlineUsers, isFetching: isFetchingOnlineUsers } = useQuery<
    OnlineUser[]
  >({
    queryFn: () => usersGetAllChat(),
    queryKey: ["online-users"],
  });

  const { data: onlineUser, isFetching: isFetchingOnlineUser } = useQuery<
  User|null
  >({
    queryFn: () => userGetByIdOnline(),
    queryKey: ["online-user"],
  });
  
  return {
    onlineUsers,
    isFetchingOnlineUsers,onlineUser,  isFetchingOnlineUser 
  };
};

