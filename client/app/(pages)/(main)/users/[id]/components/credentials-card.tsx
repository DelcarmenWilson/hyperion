"use client";
import React from "react";
import { useImageViewer } from "@/hooks/use-image-viewer";

import { Card } from "@/components/ui/card";
import { states } from "@/constants/states";
import { UserLicense } from "@prisma/client";
import { BadgeCheck } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useUserData } from "@/hooks/user/use-user";
import { useAgentLicenseData } from "../../../settings/(routes)/config/hooks/use-license";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const CredentialsCard = ({ userId }: { userId: string }) => {
  const { onGetUserById } = useUserData();
  const { user } = onGetUserById(userId);
  const { onGetLicencesForUser } = useAgentLicenseData();
  const { licenses, licensesFetching } = onGetLicencesForUser(userId);
  return (
    <Card className="flex flex-col gap-2 p-2">
      <h3 className="text-xl font-bold text-center w-full">
        LICENSES AND CREDENTIALS
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-2">
        <SkeletonWrapper isLoading={licensesFetching}>
          {licenses?.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </SkeletonWrapper>
      </div>

      <div className="text-center w-full mt-auto">
        <p className="text-muted-foreground text-lg p-2">
          National Producer #: {user?.npn}
        </p>
        <Select name="ddlState">
          <SelectTrigger className="p-10">
            <SelectValue placeholder="Choose Your State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.abv} value={state.abv}>
                <Link href={state.website} target="_blank">
                  {state.state}
                </Link>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

const LicenseCard = ({ license }: { license: UserLicense }) => {
  const { onOpen } = useImageViewer();
  const state = states.find((e) => e.abv == license.state)?.state;
  return (
    <div
      className="flex items-center gap- bg-secondary gap-2 p-3 rounded-md font-medium border hover:font-bold cursor-pointer hover:border-black"
      onClick={() => onOpen(license.image, license.state)}
    >
      <BadgeCheck className=" bg-green-600 text-white rounded-full" size={20} />

      <span className="text-xl">{state}</span>
    </div>
  );
};

export default CredentialsCard;
