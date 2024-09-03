import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversationId = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.id) {
      return "";
    }

    return params?.id as string;
  }, [params?.id]);

 
  return useMemo(
    () => ({
      conversationId,
    }),
    [conversationId]
  );
};


