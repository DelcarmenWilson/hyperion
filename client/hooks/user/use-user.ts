import { useCallback, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { toast } from "sonner";

import { User, UserRole } from "@prisma/client";
import { RegisterSchemaType } from "@/schemas/register";

import {
  createAssistant,
  createUser,
  getUserById,
  getUsers,
  getUsersByRole,
} from "@/actions/user";

import { updateUserAccountStatus, updateUserRole } from "@/actions/admin/user";
import { updateUserTeam } from "@/actions/admin/team";

import { getOnlineUser } from "@/actions/user";

export const useOnlineUserData = () => {
  const {
    data: onlineUser,
    isFetching: onlineUserFetching,
    isLoading: onlineUserLoading,
  } = useQuery<User | null>({
    queryFn: () => getOnlineUser(),
    queryKey: ["online-user"],
  });
  return {
    onlineUser,
    onlineUserFetching,
    onlineUserLoading,
  };
};

export const useUserData = () => {
  //SITE USERS
  const onGetSiteUsers = (role?: UserRole) => {
    const {
      data: siteUsers,
      isFetching: siteUsersFetching,
      isLoading: siteUsersLoading,
    } = useQuery<User[]>({
      queryKey: [`site-users-${role || "all"}`],
      queryFn: () => (role ? getUsersByRole(role) : getUsers()),
    });
    return {
      siteUsers,
      siteUsersFetching,
      siteUsersLoading,
    };
  };

  //USERS
  const onGetUsers = () => {
    const {
      data: users,
      isFetching: usersFetching,
      isLoading: usersLoading,
    } = useQuery<User[] | []>({
      queryFn: () => getUsers(),
      queryKey: ["users"],
    });
    return {
      users,
      usersFetching,
      usersLoading,
    };
  };

  //USER BY ID
  const onGetUserById = (userId: string) => {
    const {
      data: user,
      isFetching: userFetching,
      isLoading: userLoading,
    } = useQuery<User | null>({
      queryFn: () => getUserById(userId),
      queryKey: [`user-${userId}`],
    });
    return {
      user,
      userFetching,
      userLoading,
    };
  };

  //ADMINS
  const onGetAdmins = () => {
    const {
      data: admins,
      isFetching: adminsFetching,
      isLoading: adminsLoading,
    } = useQuery<User[] | []>({
      queryFn: () => getUsersByRole("ADMIN"),
      queryKey: ["admins"],
    });
    return {
      admins,
      adminsFetching,
      adminsLoading,
    };
  };

  return {
    onGetSiteUsers,
    onGetUsers,
    onGetUserById,
    onGetAdmins,
  };
};

export const useUserActions = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const { invalidate } = useInvalidate();

  //USER
  const { mutate: createUsertMutate, isPending: userCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: (result) => {
      toast.success("User Created", { id: "create-user" });
      setFormOpen(false);
      invalidate("users");
    },
    onError: (error) => toast.error(error.message, { id: "create-user" }),
  });

  const onCreateUser = useCallback(
    (values: RegisterSchemaType) => {
      toast.loading("Creating New User", { id: "create-user" });
      createUsertMutate(values);
    },
    [createUsertMutate]
  );

  //ASSISTANT
  const { mutate: createAssistantMutate, isPending: assistantCreating } =
    useMutation({
      mutationFn: createAssistant,
      onSuccess: () => {
        toast.success("Assistant Created", { id: "create-assistant" });
        setFormOpen(false);
        invalidate("users");
      },

      onError: (error) =>
        toast.error(error.message, { id: "create-assistant" }),
    });

  const onCreateAssistant = useCallback(
    (values: RegisterSchemaType) => {
      toast.loading("Creating New Asssistant", { id: "create-assistant" });
      createAssistantMutate(values);
    },
    [createAssistantMutate]
  );

  return {
    isFormOpen,
    setFormOpen,
    onCreateUser,
    userCreating,
    onCreateAssistant,
    assistantCreating,
  };
};

export const useUserAdminActions = (
  userId: string,
  user: User | null | undefined
) => {
  const router = useRouter();
  //UPDATE ROLE
  const { mutate: updateRoleMutate, isPending: userRoleUpdating } = useMutation(
    {
      mutationFn: updateUserRole,
      onSuccess: () => {
        toast.success("Role updated!", { id: "update-user-role" });
        router.refresh();
      },
      onError: () =>
        toast.error("Failed to update role", { id: "update-user-role" }),
    }
  );

  const onUpdateRole = useCallback(
    (role: string) => {
      toast.loading("Updating role ...", {
        id: "update-user-role",
      });
      updateRoleMutate({ userId: userId, newRole: role });
    },
    [updateRoleMutate]
  );

  //UPDATE ACCOUNT STATUS
  const {
    mutate: updateAccountStatusMutate,
    isPending: userAccountStatusUpdating,
  } = useMutation({
    mutationFn: updateUserAccountStatus,
    onSuccess: () =>
      toast.success("Account status updated!", {
        id: "update-user-account-status",
      }),
    onError: () =>
      toast.error("Failed to update account statius", {
        id: "update-user-account-status",
      }),
  });

  const onUpdateAccountStatus = useCallback(
    (statusId: string) => {
      toast.loading("Updating account status ...", {
        id: "update-user-account-status",
      });
      updateAccountStatusMutate({ userId: userId, statusId });
    },
    [updateAccountStatusMutate]
  );

  //UPDATE TEAM
  const { mutate: updateUserTeamMutate, isPending: userTeamUpdating } =
    useMutation({
      mutationFn: updateUserTeam,
      onSuccess: () =>
        toast.success("Team updated!", { id: "update-user-team" }),
      onError: () =>
        toast.error("Failed to update team", { id: "update-user-team" }),
    });

  const onUpdateTeam = useCallback(
    (teamId: string) => {
      toast.loading("Updating team ...", {
        id: "update-user-team",
      });
      updateUserTeamMutate({ userId: userId, teamId });
    },
    [updateUserTeamMutate]
  );

  return {
    onUpdateAccountStatus,
    onUpdateRole,
    onUpdateTeam,
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
