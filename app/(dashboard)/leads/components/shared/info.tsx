"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MessageSquare, Pencil } from "lucide-react";

import { formatPhoneNumber } from "@/formulas/phones";
import { CopyButton } from "@/components/reusable/copy-button";
import { smsCreateInitial } from "@/actions/sms";
import { toast } from "sonner";
import { FullLead } from "@/types";

interface InfoProps {
  lead: FullLead;
}
export const Info = ({ lead }: InfoProps) => {
  const router = useRouter();

  const onSendInitialSms = async () => {
    if (!lead) return;
    await smsCreateInitial(lead.id).then((data) => {
      router.refresh();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.error(data.success);
      }
    });
  };
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>{`${lead.firstName} ${lead.lastName}`}</p>
      <p className="flex items-center gap-2 text-primary">
        <Link
          className="font-extrabold italic"
          onClick={() => router.push(`/leads/${lead.id}`, {})}
          href={`/leads/${lead.id}`}
        >
          {formatPhoneNumber(lead.cellPhone)}
        </Link>
        <CopyButton value={lead.cellPhone} />
      </p>
      <p>{lead.email}</p>

      {lead.address && (
        <address>
          <p>{lead.address}</p>
          <p>{`${lead.city}, ${lead.state} ${lead.zipCode}`}</p>
        </address>
      )}

      <p className="flex gap-2">
        <span>
          Quote: <span className="text-destructive">Not set</span>
        </span>
        <Pencil className="h-4 w-4 ml-2" />
      </p>
      <div>
        {!lead.conversationId && (
          <Button variant="outlineprimary" size="xs" onClick={onSendInitialSms}>
            <MessageSquare className="h-4 w-4 mr-2" />
            SEND SMS
          </Button>
        )}
      </div>
    </div>
  );
};
