"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Check, MessageSquare, PenToolIcon, Pencil, X } from "lucide-react";

import { formatPhoneNumber } from "@/formulas/phones";
import { CopyButton } from "@/components/reusable/copy-button";
import { smsCreateInitial } from "@/actions/sms";
import { toast } from "sonner";
import { FullLead } from "@/types";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { leadUpdateByIdQuote } from "@/actions/lead";
import { USDollar } from "@/formulas/numbers";
import { FieldBox } from "./field-box";

interface InfoProps {
  lead: FullLead;
}
export const Info = ({ lead }: InfoProps) => {
  const router = useRouter();
  const [quote, setQuote] = useState(lead.quote?.toString() || "");

  const onQuoteUpdated = () => {
    const newQuote = parseInt(quote);
    if (newQuote != lead.quote) {
      lead.quote = newQuote;
      leadUpdateByIdQuote(lead.id, newQuote).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    }
  };
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
    <div className="flex flex-col gap-1 text-sm">
      <p className="font-semibold text-lg">{`${lead.firstName} ${lead.lastName}`}</p>
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

      <FieldBox
        name="Quote"
        field={quote}
        setField={setQuote}
        onFieldUpdate={onQuoteUpdated}
      />

      <div>
        {!lead.conversationId && (
          <Button
            disabled={lead.status == "Do_Not_Call"}
            variant="outlineprimary"
            size="xs"
            onClick={onSendInitialSms}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            SEND SMS
          </Button>
        )}
      </div>
    </div>
  );
};
