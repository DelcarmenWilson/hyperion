import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {  FullLeadNoConvo } from "@/types";

import { leadDeleteById, leadUpdateByIdTitan } from "@/actions/lead";
import { useCurrentRole } from "../user-current-role";
import { conversationDeleteById } from "@/actions/lead/conversation";
import { exportLeads } from "@/lib/xlsx";

export const useLeadDropdownActions = (lead: FullLeadNoConvo) => {
  const role = useCurrentRole();
  const queryClient = useQueryClient();
  const [titan, setTitan] = useState<boolean>(lead?.titan);
  const isAssistant = role == "ASSISTANT";
  const [alertDeleteConvoOpen, setAlertDeleteConvoOpen] = useState(false);
  const [alertDeleteLeadOpen, setAlertDeleteLeadOpen] = useState(false);

//   const invalidate = () => {
//     queryClient.invalidateQueries({ queryKey: [`leadPolicy-${lead.id}`] });
//   };

  //CONVERSATION DELETED
  const { mutate: conversationDeleteMutate, isPending: conversationDeleting } =
    useMutation({
      mutationFn: conversationDeleteById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success(results.success, { id: "delete-conversation" });
          //   invalidate();
          setAlertDeleteConvoOpen(false);
        } else {
          toast.error(results.error, { id: "delete-conversation" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onConversationDelete = useCallback((conversationId:string) => {
    toast.loading("Deleting Conversation...", { id: "delete-conversation" });
    conversationDeleteMutate(conversationId);
  }, [conversationDeleteMutate]);

  //LEAD DELETED
  const { mutate: leadDeleteMutate, isPending: leadDeleting } = useMutation({
    mutationFn: leadDeleteById,
    onSuccess: (results) => {
      if (results.success) {
        toast.success(results.success, { id: "delete-lead" });
        //   invalidate();
        setAlertDeleteLeadOpen(false);
      } else {
        toast.error(results.error, { id: "delete-lead" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onLeadDelete = useCallback(() => {
    toast.loading("Deleting Lead...", { id: "delete-lead" });
    leadDeleteMutate(lead.id);
  }, [leadDeleteMutate]);

  //TITAN
  const { mutate: titanUpdateMutate, isPending: titanUpdating } = useMutation({
    mutationFn: leadUpdateByIdTitan,
    onSuccess: (results) => {
      if (results.success) {
        toast.success(results.success, { id: "update-titan" });
        queryClient.invalidateQueries({
          queryKey: [`lead-basic-${results.data}`, `lead-${results.data}`],
        });
      } else toast.error(results.error, { id: "update-titan" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "update-titan" });
    },
  });

  const onTitanUpdated = useCallback(() => {
    toast.loading("Updating Titan...", { id: "update-titan" });
    setTitan((state) => !state);
    titanUpdateMutate({ id: lead.id, titan: !titan });
  }, [titanUpdateMutate]);

  const onPreExport = (fileType: string) => {
    if (isAssistant) {
      toast.error("Not Authorized");
      return;
    }
    exportLeads(fileType, [lead], `${lead.firstName} ${lead.lastName}`);
  };

  return {
    titan,
    isAssistant,
    alertDeleteConvoOpen,
    setAlertDeleteConvoOpen,
    alertDeleteLeadOpen,
    setAlertDeleteLeadOpen,
    onConversationDelete,
    conversationDeleting,
    onLeadDelete,
    leadDeleting,
    onTitanUpdated,
    titanUpdating,
    onPreExport,
  };
};
