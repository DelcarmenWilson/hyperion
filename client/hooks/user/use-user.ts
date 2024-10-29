import { useCallback, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { User } from "@prisma/client";
import { FullTeam, FullUserReport } from "@/types";
import { RegisterSchemaType } from "@/schemas/register";

import { teamsGetAll } from "@/actions/team";
import { userInsert, userInsertAssistant, usersGetAll, usersGetAllByRole } from "@/actions/user";
import { adminChangeTeam } from "@/actions/admin/team";
import { adminChangeUserAccountStatus, adminChangeUserRole } from "@/actions/admin/user";
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

export const useUserAdminActions=(user:FullUserReport)=>{
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(user.teamId!);
  const [role, setRole] = useState(user.role.toString());
  const [accountStatus, setAccountStatus] = useState(
    user.accountStatus.toString()
  );

  const onRoleChange = async () => {
    if (!role) return;
    setLoading(true);
    const updatedUserRole = await adminChangeUserRole(user.id, role);

    if (updatedUserRole.success) {
      toast.success(updatedUserRole.success);
      router.refresh();
    } else toast.error(updatedUserRole.error);
    setLoading(false);
  };
  const onAccountStatusChange = async () => {
    if (!accountStatus) return;
    setLoading(true);
    const results = await adminChangeUserAccountStatus(user.id, accountStatus);
    if (results.success) {
      toast.success(results.success);
      router.refresh();
    } else toast.error(results.error);
    setLoading(false);
  };

  const onTeamChange = async () => {
    if (!team) return;
    setLoading(true);
    const updatedTeam = await adminChangeTeam(user.id, team);

    if (updatedTeam.success) {
      toast.success(updatedTeam.success);
      router.refresh();
    } else toast.error(updatedTeam.error);
    setLoading(false);
  };

  return {
    loading, team, setTeam,role, setRole,accountStatus, setAccountStatus,
    onRoleChange,
    onAccountStatusChange,
    onTeamChange,
 
  }
}

export const useUserId = () => {
  const params = useParams();
  const userId = useMemo(() => {
    if (!params?.userid) return "";
    return params?.userid as string;
  }, [params?.userid]);
  return useMemo(() => ({ userId }), [userId]);
};
