import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";
import { Email } from "@prisma/client";
import { leadEmailsGetByLeadId } from "@/actions/lead/email";

export const useLeadEmailData = () => {
  const { leadId } = useLeadId();

  const { data: emails, isFetching: isFetchingEmails } = useQuery<Email[]>({
    queryFn: () => leadEmailsGetByLeadId(leadId),
    queryKey: [`leadEmails-${leadId}`],
    enabled:!!leadId
  });

  return {
    emails,
    isFetchingEmails,
  };
};
