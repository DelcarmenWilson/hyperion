"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { FilePenLine, MessageSquare } from "lucide-react";

import { LeadMainInfo } from "@/types";
import { formatPhoneNumber } from "@/formulas/phones";

import { Button } from "@/components/ui/button";
import { MainInfoForm } from "./forms/main-info-form";
import { CopyButton } from "@/components/reusable/copy-button";
import { FieldBox } from "./field-box";

import { smsCreateInitial } from "@/actions/sms";
import { leadUpdateByIdQuote } from "@/actions/lead";

type MainInfoProps = {
  info: LeadMainInfo;
  noConvo: boolean;
  showInfo?: boolean;
};
export const MainInfoClient = ({
  info,
  noConvo,
  showInfo = false,
}: MainInfoProps) => {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [initConvo, setInitConvo] = useState(noConvo);
  const [leadInfo, setLeadInfo] = useState<LeadMainInfo>(info);

  const onSetInfo = (e?: LeadMainInfo) => {
    if (e) {
      setLeadInfo(e);
    }
    setEdit(false);
  };
  const onQuoteUpdated = (e?: number) => {
    if (!e) {
      return;
    }
    if (leadInfo.quote != info.quote) {
      setLeadInfo((info) => ({ ...info, quote: e }));
      leadUpdateByIdQuote(info.id, e).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    }
  };
  const onSendInitialSms = () => {
    if (!info) return;
    smsCreateInitial(info.id).then((data) => {
      router.refresh();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        setInitConvo(true);
        toast.success(data.success);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      {showInfo && (
        <p className="font-semibold text-lg">{`${info.firstName} ${info.lastName}`}</p>
      )}

      <p className="flex items-center gap-2 text-primary">
        {showInfo ? (
          <Link className="font-extrabold italic" href={`/leads/${info.id}`}>
            {formatPhoneNumber(info.cellPhone)}
          </Link>
        ) : (
          <span className="font-extrabold italic">
            {formatPhoneNumber(info.cellPhone)}
          </span>
        )}
        <CopyButton value={info.cellPhone} message="Lead phone#" />
      </p>
      {edit ? (
        <MainInfoForm info={leadInfo} onChange={onSetInfo} />
      ) : (
        <div className="relative group">
          <p>{leadInfo.email}</p>

          {leadInfo.address && (
            <address>
              <p>{leadInfo.address}</p>
              <p>{`${leadInfo.city}, ${leadInfo.state} ${leadInfo.zipCode}`}</p>
            </address>
          )}
          <Button
            className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
            onClick={() => setEdit(true)}
          >
            <FilePenLine size={16} />
          </Button>
        </div>
      )}

      <FieldBox
        name="Quote"
        field={leadInfo.quote!}
        onFieldUpdate={onQuoteUpdated}
      />

      <div>
        {!initConvo && (
          <Button
            disabled={leadInfo.status == "Do_Not_Call"}
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
