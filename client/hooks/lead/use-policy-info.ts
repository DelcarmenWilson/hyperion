import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";

import { LeadPolicySchemaType, LeadPolicySchemaTypeP } from "@/schemas/lead";
import { leadGetByIdPolicy, leadUpdateByIdPolicyInfo } from "@/actions/lead";


export const useLeadPolicyData = () => {
    const { leadId} = useLeadStore();

       //POLICY
    const { data: policy, isFetching: isFetchingPolicy } =
      useQuery<LeadPolicySchemaTypeP | null>({
        queryFn: () => leadGetByIdPolicy(leadId as string),
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
      mutationFn: leadUpdateByIdPolicyInfo,
      onSuccess: (result) => {
        if (result.success) {
          userEmitter.emit("policyInfoUpdated", {
            ...result.success,
            startDate: result.success?.startDate || undefined,
          });
          userEmitter.emit("leadStatusChanged", result.success.leadId, "Sold");
  
          toast.success("Lead Policy Info Updated", {
            id: "update-policy-info",
          });
          onPolicyFormClose();
          invalidate();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  
    const onPolicySubmit = useCallback(
      (values: LeadPolicySchemaType) => {
        toast.loading("Updating Policy Information...", { id: "update-policy-info" });
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