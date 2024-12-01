import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserLicense } from "@prisma/client";
import {
  userLicenseDeleteById,
  getLicenses,
  getLicensesForUser,
} from "@/actions/user/license";

export const useAgentLicenseData = () => {
  const onGetLicences = () => {
  const { data: licenses, isFetching: licensesFetching,isLoading:licensesLoading} = useQuery<
  UserLicense[]
  >({
    queryFn: () => getLicenses(),
    queryKey: ["agent-licenses"],
  });

  return {
    licenses,
    licensesFetching,
    licensesLoading
  };}
  const onGetLicencesForUser = (userId: string) => {
    const { data: licenses, isFetching: licensesFetching,isLoading:licensesLoading} = useQuery<
    UserLicense[]
    >({
      queryFn: () => getLicensesForUser(userId),
      queryKey: [`agent-licenses-${userId}`],
      enabled:!!userId
    });
  
    return {
      licenses,
      licensesFetching,
      licensesLoading
    };}

  return {
    onGetLicences,
    onGetLicencesForUser,
  };
};

export const useAgentLicenseActions = () => {
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["agent-licenses`"] });
  };

  const { mutate: licenseDelete, isPending: isPendingLicenseDelete } =
    useMutation({
      mutationFn: userLicenseDeleteById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("License deleted", {
            id: "delete-agent-license",
          });
          invalidate();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const onLicenseDelete = useCallback(
    (id: string) => {
      toast.loading("Updating License...", { id: "delete-agent-license" });

      licenseDelete(id);
    },
    [licenseDelete]
  );

  return { alertOpen, setAlertOpen, onLicenseDelete, isPendingLicenseDelete };
};
