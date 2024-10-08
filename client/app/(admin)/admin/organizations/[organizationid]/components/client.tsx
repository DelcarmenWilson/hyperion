"use client";
import Image from "next/image";
import { Calendar, DollarSign, MessageCircle, Phone } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { useOrganizationData } from "../../hooks/use-organization";

import CountUp from "react-countup";

import { FullTeamReport, HalfUser } from "@/types";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { DatesFilter } from "@/components/reusable/dates-filter";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const OrganizationClient = () => {
  const { organization, isFetchingOrganization } = useOrganizationData();
  const user = useCurrentUser();

  return (
    <SkeletonWrapper isLoading={isFetchingOrganization}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="w-full relative h-[100px] text-center">
          <Image
            width={200}
            height={100}
            className="h-full w-full"
            src={organization?.banner || "/assets/defaults/teamBanner.jpg"}
            alt="Team Banner"
          />
          <div className="absolute flex items-center gap-4 top-0 left-0 w-full h-full text-white p-4">
            <Image
              width={60}
              height={60}
              className="rounded-full shadow-sm shadow-white h-auto w-[60px] aspect-square"
              src={organization?.logo || "/assets/defaults/teamImage.jpg"}
              alt="Team Image"
            />
            <span className=" text-2xl">{organization?.name}</span>
            {/* <div className=" ml-auto">
              {team?.owner ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm">Manager</p>
                  <Image
                    width={50}
                    height={50}
                    className="rounded-full shadow-sm shadow-white h-auto w-[50px] aspect-square"
                    src={team?.owner?.image || "/assets/defaults/teamImage.jpg"}
                    alt="Team Image"
                  />
                  <p>{team.owner?.firstName}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p>No Manager</p>
                  {(user?.role == "MASTER" || organization?.userId == user?.id) && (
                    <Dialog>
                      <DialogDescription className="hidden">
                        Add Manager Form
                      </DialogDescription>
                      <DialogTrigger asChild>
                        <Button size="sm">Add</Button>
                      </DialogTrigger>
                      <DialogContent className="p-4 max-h-[96%] max-w-max bg-background">
                        <h3 className="text-2xl font-semibold py-2">
                          Add Manager
                        </h3>
                        <div>
                          <p className="text-muted-foreground">
                            Select a Manager
                          </p>

                          <Select
                            name="ddlUsers"
                            onValueChange={setSelecteUser}
                            defaultValue={selecteUser}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.userName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button disabled={loading} onClick={onManagerChange}>
                          Add
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 p-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p>Organization</p>
            <Input
              disabled
              placeholder="Organization name"
              value={organization?.name}
            />
          </div>
        </div>
        <DatesFilter link={`/admin/organization/${organization?.id}`} />
      </div>
      <Separator />
      {/* <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 mt-4">
        {data.map((d) => (
          <Overview
            key={d.title}
            title={d.title}
            value={d.value}
            icon={d.icon}
          />
        ))}
      </div> */}
    </SkeletonWrapper>
  );
};
type OverviewProps = {
  title: string;
  value: string;
  icon?: any;
};
const Overview = ({ title, value, icon: Icon }: OverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{Icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {parseInt(value) > 0 ? (
            <CountUp start={0} end={parseInt(value)} duration={3} />
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
};
