import { useCallback } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore } from "@/stores/lead-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { LeadCommunication } from "@prisma/client";
import { SmsMessageSchemaType } from "@/schemas/message";

import {
  getCommunicationForConversation,
  createInitialMessage,
  createNewMessage,
} from "@/actions/lead/communication";
import { useInvalidate } from "../use-invalidate";

export const useLeadCommunicationData = () => {
  const { conversationId } = useLeadStore();
  //ALL MESSAGES

  const onGetCommunications = () => {
    const {
      data: communications,
      isFetching: communicationsFetching,
      isLoading: communicationsLoading,
    } = useQuery<LeadCommunication[]>({
      queryFn: () => getCommunicationForConversation(conversationId),
      queryKey: [`lead-communications-${conversationId}`],
      enabled: !!conversationId,
    });
    return {
      communications,
      communicationsFetching,
      communicationsLoading,
    };
  };

  return {
    onGetCommunications,
  };
};

export const useLeadCommunicationeActions = (cb?: () => void) => {
  const { leadId, conversationId, setConversationId } = useLeadStore();
  const {invalidate} = useInvalidate();

  //INITIAL MESSAGE
  const {
    mutate: createInitialMessageMutate,
    isPending: InitialMessageCreating,
  } = useMutation({
    mutationFn: createInitialMessage,
    onSuccess: (result) => {
      toast.success("Inital message sent!", {
        id: "create-initial-message",
      });
      setConversationId(result);
     invalidate(`lead-communications-${conversationId}`)
    },
    onError: (error) =>
      toast.error(error.message, { id: "create-initial-message" }),
  });

  const onCreateInitialMessage = useCallback(() => {
    const toastString = "Sending Intial Message..";
    toast.loading(toastString, { id: "create-initial-message" });

    createInitialMessageMutate(leadId as string);
  }, [createInitialMessageMutate]);

  //NEW MESSAGES
  const { mutate: createMessageMutate, isPending: newMessageCreating } =
    useMutation({
      mutationFn: createNewMessage,
      onSuccess: () => {
        toast.success("message sent!", { id: "create-message" });
        if (cb) cb();
      },
      onError: (error) => toast.error(error.message, { id: "create-message" }),
    });

  const onCreateMessageInsert = useCallback(
    (values: SmsMessageSchemaType) => {
      const toastString = "Sending Message..";
      toast.loading(toastString, { id: "create-message" });
      values.leadId = leadId;
      values.conversationId = conversationId;
      createMessageMutate(values);
    },
    [createMessageMutate, leadId, conversationId]
  );

  return {
    onCreateInitialMessage,
    InitialMessageCreating,
    onCreateMessageInsert,
    newMessageCreating,
  };
};
