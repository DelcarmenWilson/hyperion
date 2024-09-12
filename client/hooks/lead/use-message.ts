import { useCallback} from "react";
import {  useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {  LeadMessage } from "@prisma/client";
import { SmsMessageSchemaType } from "@/schemas/message";

import {
  messageCreate,
  messageCreateInitial,
  messagesGetAllByConversationId,
} from "@/actions/lead/message";

export const useLeadMessageActions = (onCancel?: () => void) => {
  const { leadId, conversationId, setConversationId } = useLeadStore();
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [`leadMessages-${conversationId}`],
    });
  };
  //ALL MESSAGES
  //TODO see if we can some type of pagination
  const { data: messages, isFetching: isFetchingMessages } = useQuery<
    LeadMessage[]
  >({
    queryFn: () => messagesGetAllByConversationId(conversationId),
    queryKey: [`leadMessages-${conversationId}`],
  });
  //INITIAL MESSAGE
  const { mutate: initialMessageMutate, isPending: IsPendinginitialMessage } =
    useMutation({
      mutationFn: messageCreateInitial,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Inital message sent!", {
            id: "insert-initial-message",
          });
          setConversationId(result.success);
          invalidate();
        } else {
          toast.error(result.error, {
            id: "insert-initial-message",
          });
        }
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
      mutationFn: messageCreate,
      // onMutate: async (newMessage) => {
      //   // Cancel any outgoing refetches
      //   // (so they don't overwrite our optimistic update)
      //   const key=`leadMessages-${conversationId}`
      //           await queryClient.cancelQueries({ queryKey: [key] })

      //   // Snapshot the previous value
      //   const previousMessages = queryClient.getQueryData([key])

      //   // Optimistically update to the new value
      //   //@ts-ignore
      //   queryClient.setQueryData([key], (old) => [...old, newMessage])

      //   // Return a context object with the snapshotted value
      //   return { previousMessages }
      // },
      onSuccess: (result) => {
        if (result.success) {
          toast.success("message sent!", {
            id: "insert-message",
          });
          if (onCancel) onCancel();

           const key=`leadMessages-${conversationId}`
          //@ts-ignore
          queryClient.setQueryData([key], (old) => [...old, result.success]);
        } else {
          toast.error(result.error, {
            id: "insert-message",
          });
        }
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
    [initialMessageMutate]
  );

  return {
    messages,
    isFetchingMessages,
    onMessageInitialSubmit,
    IsPendinginitialMessage,
    onMessageInsertSubmit,
    IsPendingInsertMessage,
  };
};
