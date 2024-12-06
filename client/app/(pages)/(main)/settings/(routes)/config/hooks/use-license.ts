import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserLicense } from "@prisma/client";
import {
  createLicense,
  deleteLicense,
  getLicenses,
  getLicensesForUser,
  updateLicense,
} from "@/actions/user/license";
import { useInvalidate } from "@/hooks/use-invalidate";
import { UserLicenseSchemaType } from "@/schemas/user";

export const useAgentLicenseData = () => {
  const onGetLicences = () => {
    const {
      data: licenses,
      isFetching: licensesFetching,
      isLoading: licensesLoading,
    } = useQuery<UserLicense[]>({
      queryFn: () => getLicenses(),
      queryKey: ["agent-licenses"],
    });

    return {
      licenses,
      licensesFetching,
      licensesLoading,
    };
  };
  const onGetLicencesForUser = (userId: string) => {
    const {
      data: licenses,
      isFetching: licensesFetching,
      isLoading: licensesLoading,
    } = useQuery<UserLicense[]>({
      queryFn: () => getLicensesForUser(userId),
      queryKey: [`agent-licenses-${userId}`],
      enabled: !!userId,
    });

    return {
      licenses,
      licensesFetching,
      licensesLoading,
    };
  };

  return {
    onGetLicences,
    onGetLicencesForUser,
  };
};
//CREATE LICENSE
export const useAgentLicenseActions = (cb?: () => void) => {
  const { invalidate } = useInvalidate();

  const { mutate: deleteLicenseMutate, isPending: licenseDeleting } =
    useMutation({
      mutationFn: deleteLicense,
      onSuccess: () => {
        toast.success("License deleted", {
          id: "delete-agent-license",
        });
        invalidate("agent-licenses");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "delete-agent-license",
        }),
    });
  const onDeleteLicense = useCallback(
    (id: string) => {
      toast.loading("Deleting License...", { id: "delete-agent-license" });

      deleteLicenseMutate(id);
    },
    [deleteLicenseMutate]
  );

  const { mutate: createLicenseMutate, isPending: licenseCreating } =
    useMutation({
      mutationFn: createLicense,
      onSuccess: () => {
        if (cb) cb();
        toast.success("License created", {
          id: "create-license",
        });
        invalidate("agent-licenses");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "create-license",
        }),
    });
  const onCreateLicense = useCallback(
    (values: UserLicenseSchemaType) => {
      toast.loading("Creating License...", { id: "create-license" });
      createLicenseMutate(values);
    },
    [createLicenseMutate]
  );

  //UPDATE LICENSE
  const { mutate: updateLicenseMutate, isPending: licenseUpdating } =
    useMutation({
      mutationFn: updateLicense,
      onSuccess: () => {
        if (cb) cb();
        toast.success("License updated", {
          id: "update-license",
        });
        invalidate("agent-licenses");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "update-license",
        }),
    });
  const onUpdateLicense = useCallback(
    (values: UserLicenseSchemaType) => {
      toast.loading("Updating License...", { id: "update-license" });
      updateLicenseMutate(values);
    },
    [updateLicenseMutate]
  );

  return {
    onDeleteLicense,
    licenseDeleting,
    onCreateLicense,
    licenseCreating,
    onUpdateLicense,
    licenseUpdating,
  };
};
