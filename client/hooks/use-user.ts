import { User, UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { usersGetAll, usersGetAllByRole } from "@/actions/user";


export const useUserData = (role?:UserRole) => {
  const { data: users, isFetching:isUserFetching } = useQuery<User[]>({
    queryKey: ["siteUsers"],
    queryFn: () => (role ? usersGetAllByRole(role) : usersGetAll()),
  });
  return {
    users,
    isUserFetching,
  };
};



