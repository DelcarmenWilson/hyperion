"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useAgentCarrierActions,
  useAgentCarrierData,
} from "../../hooks/use-carrier";

import { FullUserCarrier } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardData } from "@/components/reusable/card-data";
import CarrierDrawer from "./drawer";
import DeleteDialog from "@/components/custom/delete-dialog";
import { EmptyData } from "@/components/lead/info/empty-data";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

type CarrierListProps = {
  size?: string;
};

const CarrierList = ({ size = "full" }: CarrierListProps) => {
  const { carriers, isFetchingCarriers } = useAgentCarrierData();
  return (
    <SkeletonWrapper isLoading={isFetchingCarriers}>
      {carriers?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {carriers.map((carrier) => (
            <CarrierCard key={carrier.id} carrier={carrier} />
          ))}
        </div>
      ) : (
        <EmptyData title="No Carriers Found" />
      )}
    </SkeletonWrapper>
  );
};

const CarrierCard = ({ carrier }: { carrier: FullUserCarrier }) => {
  const { onDeleteCarrier, carrierDeleting } = useAgentCarrierActions();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CarrierDrawer
        carrier={carrier}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Card className="flex flex-col hover:bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="rounded-full">
              <AvatarImage
                className="rounded-full"
                src={carrier.carrier.image || ""}
              />
              <AvatarFallback className="rounded-full bg-primary/50 text-xs">
                {carrier.carrier.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-xl text-primary font-semibold text-center">{`${carrier.carrier.name}`}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 overflow-hidden text-sm">
          <CardData label="Agent Id" value={carrier.agentId} />
          <CardData label="Commision Rate" value={`${carrier.rate}%`} />
          <CardData
            label="Date Created"
            value={formatDate(carrier.createdAt)}
          />
          <CardData
            label="Date Updated"
            value={formatDate(carrier.updatedAt)}
          />
        </CardContent>
        <CardFooter className="flex group gap-2 justify-end items-center mt-auto">
          <DeleteDialog
            title="Are your sure you want to delete this carrier?"
            btnClass="opacity-0 group-hover:opacity-100 w-fit"
            cfText={carrier.carrier.name}
            onConfirm={() => onDeleteCarrier(carrier.id)}
            loading={carrierDeleting}
          />
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CarrierList;
