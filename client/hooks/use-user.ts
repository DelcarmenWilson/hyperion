import { User, UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { usersGetAll, usersGetAllByRole } from "@/actions/user";

//TODO need to renam this file accourdinly
export const useUserData = (role?:UserRole) => {
  const { data: users, isFetching:isUserFetching } = useQuery<User[]>({
    queryKey: [`site-users-${role}`],
    queryFn: () => (role ? usersGetAllByRole(role) : usersGetAll()),
  });
  return {
    users,
    isUserFetching,
  };
};



