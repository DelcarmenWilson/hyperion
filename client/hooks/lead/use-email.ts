import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";
import { LeadEmail } from "@prisma/client";
import { leadEmailsGetByLeadId } from "@/actions/lead/email";

export const useLeadEmailData = () => {
  const { leadId } = useLeadId();

  const { data: emails, isFetching: isFetchingEmails } = useQuery<LeadEmail[]>({
    queryFn: () => leadEmailsGetByLeadId(leadId),
    queryKey: [`leadEmails-${leadId}`],
  });

  return {
    emails,
    isFetchingEmails,
  };
};
