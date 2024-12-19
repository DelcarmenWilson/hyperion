import { useCallback } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore } from "@/stores/lead-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { LeadCommunication } from "@prisma/client";
import { SmsMessageSchemaType } from "@/schemas/message";

import {
  getMessagesForConversation,
  createInitialMessage,
  createNewMessage,
} from "@/actions/lead/message";

//TODO - this file has to be removed before we get rid of all the tables and actions
export const useLeadMessageData = () => {
  const { conversationId } = useLeadStore();
  //ALL MESSAGES

  const onGetMessages = () => {
    const {
      data: messages,
      isFetching: messagesFetching,
      isLoading: messagesLoading,
    } = useQuery<LeadCommunication[]>({
      queryFn: () => getMessagesForConversation(conversationId),
      queryKey: [`leadMessages-${conversationId}`],
      enabled: !!conversationId,
    });
    return {
      messages,
      messagesFetching,
      messagesLoading,
    };
  };

  return {
    onGetMessages,
  };
};

export const useLeadMessageActions = (callback?: () => void) => {
  const { leadId, conversationId, setConversationId } = useLeadStore();
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [`leadMessages-${conversationId}`],
    });
  };

  //INITIAL MESSAGE
  const { mutate: initialMessageMutate, isPending: IsPendinginitialMessage } =
    useMutation({
      mutationFn: createInitialMessage,
      onSuccess: (result) => {
        toast.success("Inital message sent!", {
          id: "insert-initial-message",
        });
        setConversationId(result);
        invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMessageInitialSubmit = useCallback(() => {
    const toastString = "Sending Intial Message..";
    toast.loading(toastString, { id: "insert-initial-message" });

    initialMessageMutate(leadId as string);
  }, [initialMessageMutate]);

  //NEW MESSAGES
  const { mutate: insertMessageMutate, isPending: IsPendingInsertMessage } =
    useMutation({
      mutationFn: createNewMessage,
      onSuccess: (result) => {
        toast.success("message sent!", {
          id: "insert-message",
        });
        if (callback) callback();
        userEmitter.emit("messageInserted", result);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMessageInsertSubmit = useCallback(
    (values: SmsMessageSchemaType) => {
      const toastString = "Sending Message..";
      toast.loading(toastString, { id: "insert-message" });
      values.leadId = leadId;
      values.conversationId = conversationId;
      insertMessageMutate(values);
    },
    [initialMessageMutate, leadId, conversationId]
  );

  return {
    onMessageInitialSubmit,
    IsPendinginitialMessage,
    onMessageInsertSubmit,
    IsPendingInsertMessage,
  };
};
