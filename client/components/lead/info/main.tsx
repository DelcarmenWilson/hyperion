"use client";
import Link from "next/link";

import {
  useLeadStore,
  useLeadInfoData,
  useLeadInfoActions,
} from "@/hooks/lead/use-lead";

import { CopyButton } from "@/components/reusable/copy-button";
import { EmptyData } from "./empty-data";
import { FieldBox } from "../field-box";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatPhoneNumber } from "@/formulas/phones";

type MainInfoProps = {
  leadId: string;
  noConvo: boolean;
  showInfo?: boolean;
  showEdit?: boolean;
};
export const MainInfoClient = ({
  leadId,
  noConvo,
  showInfo = false,
  showEdit = true,
}: MainInfoProps) => {
  const { onMainFormOpen } = useLeadStore();
  const { onGetLeadMainInfo } = useLeadInfoData(leadId);
  const { mainInfo, mainInfoFetching } = onGetLeadMainInfo();
  const { onLeadUpdateQuote } = useLeadInfoActions();

  return (
    <SkeletonWrapper isLoading={mainInfoFetching}>
      {mainInfo ? (
        <SectionWrapper
          title="Main"
          onClick={() => showEdit && onMainFormOpen(mainInfo.id)}
        >
          <div className="space-y-1 text-sm">
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
            </div>
            <FieldBox
              name="Quote"
              field={mainInfo.quote!}
              onFieldUpdate={(e) =>
                onLeadUpdateQuote({ id: leadId, quote: e as string })
              }
            />
          </div>
        </SectionWrapper>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
