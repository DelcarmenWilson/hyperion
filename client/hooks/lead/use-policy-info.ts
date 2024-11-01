import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";

import { LeadPolicySchemaType, LeadPolicySchemaTypeP } from "@/schemas/lead";
import { leadPolicyGet,leadPolicyUpsert } from "@/actions/lead/policy";

export const useLeadPolicyData = () => {
  const { leadId } = useLeadStore();

  //POLICY
  const { data: policy, isFetching: isFetchingPolicy } =
    useQuery<LeadPolicySchemaTypeP | null>({
      queryFn: () => leadPolicyGet(leadId as string),
      queryKey: [`leadPolicy-${leadId}`],
    });

  return {
    policy,
    isFetchingPolicy,
  };
};

export const useLeadPolicyActions = () => {
  const { leadId, isPolicyFormOpen, onPolicyFormClose } = useLeadStore();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`leadPolicy-${leadId}`] });
  };

  //POLICY
  const { mutate: policyMutate, isPending: policyIsPending } = useMutation({
    mutationFn: leadPolicyUpsert ,
    onSuccess: (results) => {
      if (results.success) {
        userEmitter.emit("policyInfoUpdated", {
          ...results.success,
          startDate: results.success?.startDate || undefined,
        });
        userEmitter.emit("leadStatusChanged", results.success.leadId, "Sold");

        toast.success("Lead Policy Info Updated", { id: "update-policy-info" });
        onPolicyFormClose();
        invalidate();
      } else {
        toast.error(results.error, { id: "update-policy-info" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPolicySubmit = useCallback(
    (values: LeadPolicySchemaType) => {
      toast.loading("Updating Policy Information...", {
        id: "update-policy-info",
      });
      policyMutate(values);
    },
    [policyMutate]
  );

  return {
    isPolicyFormOpen,
    onPolicyFormClose,
    onPolicySubmit,
    policyIsPending,
  };
};
