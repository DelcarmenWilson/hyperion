"use client";
import Link from "next/link";

import { FilePenLine, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CopyButton } from "@/components/reusable/copy-button";
import { FieldBox } from "../field-box";

import { formatPhoneNumber } from "@/formulas/phones";

import { LeadMainSchemaType } from "@/schemas/lead";
import { useLead, useLeadMainInfoActions } from "@/hooks/use-lead";

type MainInfoProps = {
  info: LeadMainSchemaType;
  noConvo: boolean;
  showInfo?: boolean;
  showEdit?: boolean;
};
export const MainInfoClient = ({
  info,
  noConvo,
  showInfo = false,
  showEdit = true,
}: MainInfoProps) => {
  const { onMainFormOpen } = useLead();
  const { initConvo, onLeadUpdateByIdQuote, onLeadSendInitialSms } =
    useLeadMainInfoActions(() => {}, noConvo);

  return (
    <>
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
          <p>{info.email}</p>

          {info.address != "N/A" ? (
            <address>
              <p>{info.address}</p>
              <p>{`${info.city}, ${info.state} ${info.zipCode}`}</p>
            </address>
          ) : (
            <address>
              <p>No Address</p>
              <p>State: {info.state}</p>
            </address>
          )}

          {showEdit && (
            <Button
              className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
              onClick={() => onMainFormOpen(info.id)}
            >
              <FilePenLine size={16} />
            </Button>
          )}
        </div>
        <FieldBox
          name="Quote"
          field={info.quote!}
          onFieldUpdate={onLeadUpdateByIdQuote}
        />

        <div>
          {!initConvo && (
            <Button
              className="gap-2"
              disabled={info.status == "Do_Not_Call"}
              variant="outlineprimary"
              size="xs"
              onClick={()=>onLeadSendInitialSms(info.id)}
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
