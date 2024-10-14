import { useQuery } from "@tanstack/react-query";

import { User } from "@prisma/client";
import { userGetByIdOnline } from "@/actions/user";

export const useOnlineUserData = () => {
  const { data: onlineUser, isFetching: isFetchingOnlineUser } =
    useQuery<User | null>({
      queryFn: () => userGetByIdOnline(),
      queryKey: ["online-user"],
    });

  return {
    onlineUser,
    isFetchingOnlineUser,
  };
};
