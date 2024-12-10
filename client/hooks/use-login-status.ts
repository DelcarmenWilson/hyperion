import { useQuery } from "@tanstack/react-query";
import { LoginStatus } from "@prisma/client";
import { getLoginStatusForUser } from "@/actions/login-status";

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
