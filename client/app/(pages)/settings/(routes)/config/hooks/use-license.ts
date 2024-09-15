import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserLicense } from "@prisma/client";
import {
  userLicenseDeleteById,
  userLicensesGetAll,
} from "@/actions/user/license";

export const useAgentLicenseData = () => {
  const { data: licenses, isFetching: isFetchingLicenses} = useQuery<
  UserLicense[]
  >({
    queryFn: () => userLicensesGetAll(),
    queryKey: ["agent-licenses"],
  });

  return {
    licenses,
    isFetchingLicenses,
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
