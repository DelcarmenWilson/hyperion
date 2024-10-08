import { useCallback, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { User } from "@prisma/client";
import { FullTeam } from "@/types";
import { RegisterSchemaType } from "@/schemas/register";

import { teamsGetAll } from "@/actions/team";
import { userInsert, userInsertAssistant, usersGetAll, usersGetAllByRole } from "@/actions/user";

export const useUserData = () => {
  //USERS
  const { data: users, isFetching: isFetchingUsers } = useQuery<User[] | []>({
    queryFn: () => usersGetAll(),
    queryKey: ["users"],
  });
  //ADMINS
  const { data: admins, isFetching: isFetchingAdmins } = useQuery<User[] | []>({
    queryFn: () => usersGetAllByRole("ADMIN"),
    queryKey: ["admins"],
  });
  //TEAMS
  const { data: teams, isFetching: isFetchingTeams } = useQuery<
    FullTeam[] | []
  >({
    queryFn: () => teamsGetAll(),
    queryKey: ["userTeams"],
  });

  return {
    users,
    isFetchingUsers,
    admins,
    isFetchingAdmins,
    teams,
    isFetchingTeams,
  };
};

export const useUserActions = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  //USER
  const { mutate: userInsertMutate, isPending: userIsPending } = useMutation({
    mutationFn: userInsert,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User Created", { id: "insert-user" });
        setFormOpen(false);
        invalidate();
      } else toast.error(result.error, { id: "insert-user" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onUserInsert = useCallback(
    (values: RegisterSchemaType) => {
      toast.loading("Creating New User", { id: "insert-user" });
      userInsertMutate(values);
    },
    [userInsertMutate]
  );

  //ASSISTANT
  const { mutate: assistantInsertMutate, isPending: assistantIsPending } = useMutation({
    mutationFn: userInsertAssistant,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Assistant Created", { id: "insert-assistant" });
        setFormOpen(false);
        invalidate();
      } else toast.error(result.error, { id: "insert-assistant" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onAssistantInsert = useCallback(
    (values: RegisterSchemaType) => {
      toast.loading("Creating New Asssistant", { id: "insert-assistant" });
      assistantInsertMutate(values);
    },
    [assistantInsertMutate]
  );

  return {

    isFormOpen,
    setFormOpen,onUserInsert,userIsPending,
    onAssistantInsert,
    assistantIsPending,
  };
};

export const useUserId = () => {
  const params = useParams();
  const userId = useMemo(() => {
    if (!params?.userid) return "";
    return params?.userid as string;
  }, [params?.userid]);
  return useMemo(() => ({ userId }), [userId]);
};
