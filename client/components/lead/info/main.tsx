"use client";
import Link from "next/link";

import { FilePenLine, MessageSquare } from "lucide-react";
import { useLeadStore, useLeadMainInfoActions } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/reusable/copy-button";
import { FieldBox } from "../field-box";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { formatPhoneNumber } from "@/formulas/phones";

type MainInfoProps = {
  noConvo: boolean;
  showInfo?: boolean;
  showEdit?: boolean;
};
export const MainInfoClient = ({
  noConvo,
  showInfo = false,
  showEdit = true,
}: MainInfoProps) => {
  const { onMainFormOpen } = useLeadStore();
  const { mainInfo, isFetchingMainInfo, initConvo, onLeadUpdateByIdQuote } =
    useLeadMainInfoActions(() => {}, noConvo);

  if (!mainInfo) return null;

  return (
    <div className="space-y-1 text-sm">
      <SkeletonWrapper isLoading={isFetchingMainInfo}>
        {showInfo && (
          <p className="font-semibold text-lg">{`${mainInfo.firstName} ${mainInfo.lastName}`}</p>
        )}
        <p className="flex items-center gap-2 text-primary">
          {showInfo ? (
            <Link
              className="font-extrabold italic"
              href={`/leads/${mainInfo.id}`}
            >
              {formatPhoneNumber(mainInfo.cellPhone)}
            </Link>
          ) : (
            <span className="font-extrabold italic">
              {formatPhoneNumber(mainInfo.cellPhone)}
            </span>
          )}
          <CopyButton value={mainInfo.cellPhone} message="Lead phone#" />
          <span>{mainInfo.textCode}</span>
        </p>
        <div className="relative group">
          <p>{mainInfo.email}</p>

          {mainInfo.address != "N/A" ? (
            <address>
              <p>{mainInfo.address}</p>
              <p>{`${mainInfo.city}, ${mainInfo.state} ${mainInfo.zipCode}`}</p>
            </address>
          ) : (
            <address>
              <p>No Address</p>
              <p>State: {mainInfo.state}</p>
            </address>
          )}

          {showEdit && (
            <Button
              className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
              onClick={() => onMainFormOpen(mainInfo.id)}
            >
              <FilePenLine size={16} />
            </Button>
          )}
        </div>
        <FieldBox
          name="Quote"
          field={mainInfo.quote!}
          onFieldUpdate={onLeadUpdateByIdQuote}
        />
        {/* TODO dont forget to remove after moving this button to the send sms box */}
        {/* <div>
          {!initConvo && (
            <Button
              className="gap-2"
              disabled={mainInfo.status == "Do_Not_Call"}
              variant="outlineprimary"
              size="xs"
              onClick={() => onLeadSendInitialSms()}
            >
              <MessageSquare size={16} />
              SEND SMS
            </Button>
          )}
        </div> */}
      </SkeletonWrapper>
    </div>
  );
};
