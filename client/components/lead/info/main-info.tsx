"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { userEmitter } from "@/lib/event-emmiter";

import { FilePenLine, MessageSquare } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { MainInfoForm } from "../forms/main-info-form";
import { CopyButton } from "@/components/reusable/copy-button";
import { FieldBox } from "../field-box";

import { formatPhoneNumber } from "@/formulas/phones";

import { smsCreateInitial } from "@/actions/sms";
import { leadUpdateByIdQuote } from "@/actions/lead";
import { LeadMainSchemaType } from "@/schemas/lead";

type MainInfoProps = {
  info: LeadMainSchemaType;
  noConvo: boolean;
  showInfo?: boolean;
};
export const MainInfoClient = ({
  info,
  noConvo,
  showInfo = false,
}: MainInfoProps) => {
  const router = useRouter();
  const [initConvo, setInitConvo] = useState(noConvo);
  const [leadInfo, setLeadInfo] = useState<LeadMainSchemaType>(info);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSetInfo = (e: LeadMainSchemaType) => {
    console.log(e);
    if (e.id == info.id) setLeadInfo(e);
  };

  const onQuoteUpdated = async (e?: string) => {
    if (!e) {
      return;
    }
    if (leadInfo.quote != info.quote) {
      setLeadInfo((info) => ({ ...info, quote: e }));
      const updatedQuote = await leadUpdateByIdQuote(info.id, e);
      if (updatedQuote.success) {
        toast.success(updatedQuote.success);
      } else toast.error(updatedQuote.error);
    }
  };
  const onSendInitialSms = async () => {
    if (!info) return;
    const createdSms = await smsCreateInitial(info.id);
    router.refresh();
    if (createdSms.success) {
      setInitConvo(true);
      toast.success(createdSms.success);
    } else toast.error(createdSms.error);
  };

  useEffect(() => {
    userEmitter.on("mainInfoUpdated", (info) => onSetInfo(info));
  }, [info]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h3 className="text-2xl font-semibold py-2">
            Demographics -
            <span className="text-primary">
              {`${leadInfo.firstName} ${leadInfo.lastName}`}
            </span>
          </h3>
          <MainInfoForm
            info={leadInfo as LeadMainSchemaType}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="space-y-1 text-sm">
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
          <span>{info.textCode}</span>
        </p>
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
            onClick={() => setDialogOpen(true)}
          >
            <FilePenLine size={16} />
          </Button>
        </div>
        <FieldBox
          name="Quote"
          field={leadInfo.quote!}
          onFieldUpdate={onQuoteUpdated}
        />

        <div>
          {!initConvo && (
            <Button
              className="gap-2"
              disabled={leadInfo.status == "Do_Not_Call"}
              variant="outlineprimary"
              size="xs"
              onClick={onSendInitialSms}
            >
              <MessageSquare size={16} />
              SEND SMS
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
