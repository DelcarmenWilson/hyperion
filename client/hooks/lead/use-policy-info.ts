import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore } from "./use-lead";
import { useInvalidate } from "../use-invalidate";
import { toast } from "sonner";

import { LeadPolicySchemaType, LeadPolicySchemaTypeP } from "@/schemas/lead";
import { getLeadPolicy, createOrUpdateLeadPolicy } from "@/actions/lead/policy";

export const useLeadPolicyData = () => {
  //POLICY
  const onGetLeadPolicy = (leadId:string) => {
    const {
      data: policy,
      isFetching: policyFetching,
      isLoading: policyLoading,
    } = useQuery<LeadPolicySchemaTypeP | null>({
      queryFn: () => getLeadPolicy(leadId),
      queryKey: [`lead-policy-${leadId}`],
      enabled: !!leadId,
    });
    return {
      policy,
      policyFetching,
      policyLoading,
    };
  };

  return {
    onGetLeadPolicy,
  };
};

export const useLeadPolicyActions = (cb:()=>void) => {
  const { invalidate } = useInvalidate();

  //POLICY
  const { mutate: updatePolicyMutate, isPending: policyUpdating } = useMutation({
    mutationFn: createOrUpdateLeadPolicy,
    onSuccess: (results) => {
    
        userEmitter.emit("policyInfoUpdated", {
          ...results,
          startDate: results?.startDate || undefined,
        });
        userEmitter.emit("leadStatusChanged", results.leadId, "Sold");

        toast.success("Lead Policy Info Updated", { id: "update-policy-info" });
        invalidate("blueprint-active");
        invalidate("blueprint-week-active");
        invalidate(`lead-policy-${results.leadId}`);
        cb();
     
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-policy-info" })
  });

  const onUpdatePolicy = useCallback(
    (values: LeadPolicySchemaType) => {
      toast.loading("Updating Policy Information...", {
        id: "update-policy-info",
      });
      updatePolicyMutate(values);
    },
    [updatePolicyMutate]
  );

  return {
     onUpdatePolicy,
    policyUpdating,
  };
};
