import React from "react";
import { MiniJob } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputGroup } from "@/components/reusable/input-group";
import { formatDate } from "@/formulas/dates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  miniJob: MiniJob;
};

export const MiniJobCard = ({ miniJob }: Props) => {
  const {
    id,
    name,
    jobId,
    description,
    status,
    comments,
    startAt,
    endAt,
    createdAt,
    updatedAt,
  } = miniJob;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[200px] overflow-hidden">
        <ScrollArea>
          <InputGroup title="Status" value={status} />
          <InputGroup title="Comments" value={comments} />
          <InputGroup title="Start At" value={formatDate(startAt)} />
          <InputGroup title="End At" value={formatDate(endAt)} />
          <InputGroup title="Created At" value={formatDate(createdAt)} />
          <InputGroup title="Updated At" value={formatDate(updatedAt)} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <Button size="sm" asChild>
          <Link href={`/admin/jobs/${jobId}/${id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
