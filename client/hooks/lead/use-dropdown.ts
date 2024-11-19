import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentRole } from "../user/use-current";
import { useInvalidate } from "../use-invalidate";

import { FullLeadNoConvo } from "@/types";

import { exportLeads } from "@/lib/xlsx";
import { deleteLead } from "@/actions/lead/main/delete-lead";
import { deleteConversation } from "@/actions/lead/conversation/delete-conversation";
import { leadUpdateByIdTitan } from "@/actions/lead";

export const useLeadDropdownActions = (lead: FullLeadNoConvo) => {
  const role = useCurrentRole();
  const { invalidate } = useInvalidate();
  const [titan, setTitan] = useState<boolean>(lead?.titan);
  const isAssistant = role == "ASSISTANT";
  const [alertDeleteConvoOpen, setAlertDeleteConvoOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  //CONVERSATION DELETED
  const { mutate: conversationDeleteMutate, isPending: conversationDeleting } =
    useMutation({
      mutationFn: deleteConversation,
      onSuccess: () => {
        toast.success("Conversation Deleted", { id: "delete-conversation" });
        setAlertDeleteConvoOpen(false);
      },
      onError: (error) =>
        toast.error(error.message, { id: "delete-conversation" }),
    });

  const onConversationDelete = useCallback(
    (conversationId: string) => {
      toast.loading("Deleting Conversation...", { id: "delete-conversation" });
      conversationDeleteMutate(conversationId);
    },
    [conversationDeleteMutate]
  );

  //LEAD DELETED
  const { mutate: leadDeleteMutate, isPending: leadDeleting } = useMutation({
    mutationFn: deleteLead,
    onSuccess: (results) => {
      if (results.success) {
        invalidate("leads");
        toast.success("Lead deleted successfully", { id: "delete-lead" });
        if (pathName === `/leads/${results.success}`) router.push("/leads");
      } else {
        toast.error(results.error, { id: "delete-lead" });
      }
    },
    onError: (error) => {
      toast.error(error.message, { id: "delete-lead" });
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
        invalidate(`lead-basic-${results.data}`);
        invalidate(`lead-${results.data}`);
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
    onConversationDelete,
    conversationDeleting,
    onLeadDelete,
    leadDeleting,
    onTitanUpdated,
    titanUpdating,
    onPreExport,
  };
};
