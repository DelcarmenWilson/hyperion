import { useCallback, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { FullOrganization } from "@/types";
import { SuperAdminRegisterSchemaType } from "@/schemas/register";

import {
  organizationGetById,
  organizationInsert,
  organizationsGetAll,
} from "@/actions/organization";

export const useOrganizationData = () => {
  const { organizationId } = useOrganizationId();
  //ORGANIZATIONS
  const { data: organizations, isFetching: isFetchingOrganizations } = useQuery<
    FullOrganization[] | []
  >({
    queryFn: () => organizationsGetAll(),
    queryKey: ["organizations"],
  });

  const { data: organization, isFetching: isFetchingOrganization } =
    useQuery<FullOrganization | null>({
      queryFn: () => organizationGetById(organizationId),
      queryKey: [`organization-${organizationId}`],
    });

  return {
    organizations,
    isFetchingOrganizations,
    organization,
    isFetchingOrganization,
  };
};

export const useOrganizationActions = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
  };

  //ORGANIZATION
  const {
    mutate: organizationInsertMutate,
    isPending: organizationsIsPending,
  } = useMutation({
    mutationFn: organizationInsert,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Organization Created", { id: "insert-organization" });
        setFormOpen(false);
        invalidate();
      } else {
        toast.error(result.error, { id: "insert-organization" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onOrganizationInsert = useCallback(
    (values: SuperAdminRegisterSchemaType) => {
      toast.loading("Creating New Organization", { id: "insert-organization" });
      organizationInsertMutate(values);
    },
    [organizationInsertMutate]
  );

  return {
    isFormOpen,
    setFormOpen,
    onOrganizationInsert,
    organizationsIsPending,
  };
};

export const useOrganizationId = () => {
  const params = useParams();
  const organizationId = useMemo(() => {
    if (!params?.organizationid) return "";
    return params?.organizationid as string;
  }, [params?.organizationid]);
  return useMemo(() => ({ organizationId }), [organizationId]);
};
