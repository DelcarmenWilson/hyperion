"use client";

import Image from "next/image";
import {
  Calendar,
  DollarSign,
  Edit,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";

import { useUserAdminActions } from "@/hooks/user/use-user";

import { Team } from "@prisma/client";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { UserRoles, UserAccountStatus } from "@/types/user";

import { Button } from "@/components/ui/button";
import { CardCountUp } from "@/components/custom/card/count-up";
import { CardLayout } from "@/components/custom/card/layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DatesFilter } from "@/components/reusable/dates-filter";
import { FullUserReport } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { USDollar } from "@/formulas/numbers";
import { capitalize } from "@/formulas/text";
import { useProfile } from "@/hooks/user/use-profile";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import UpdateTeamDialog from "./update-team-dialog";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import PhoneNumbersCard from "./phone-numbers-card";
import UpdateRoleDialog from "./update-role-dialog";
import UpdateAccountStatusDialog from "./update-account-status-dialog";

type UserClientProps = {
  userId: string;
  dateRange: DateRange;
  setDateRange: (e: DateRange) => void;
};

export const UserClient = ({
  userId,
  dateRange,
  setDateRange,
}: UserClientProps) => {
  const { onGetProfile } = useProfile();
  const { user, userFetching, userLoading } = onGetProfile(userId, dateRange);

  const { onUpdateAccountStatus, onUpdateRole, onUpdateTeam } =
    useUserAdminActions(userId, user);

  if (!user) return null;

  const ap = user.leads.reduce(
    (sum, lead) => sum + parseFloat(lead.policy?.ap!),
    0
  );
  const calls = user.conversations.reduce(
    (sum, c) => sum + c.communications.length,
    0
  );
  const data = [
    {
      title: "Calls",
      value: calls.toString() || "0",
      icon: <Phone />,
    },
    {
      title: "Conversations",
      value: user.conversations?.length.toString() || "0",
      icon: <MessageCircle />,
    },
    {
      title: "Appointments",
      value: user.appointments?.length.toString() || "0",
      icon: <Calendar />,
    },
    {
      title: "Annual Premuim",
      value: USDollar.format(ap),
      icon: <DollarSign />,
    },
  ];

  return (
    <>
      <div className="flex bg-user items-center justify-between gap-2">
        <div className="w-full h-[100px] text-center group">
          <div className="flex items-center gap-4 w-full h-full p-4">
            <Image
              width={60}
              height={60}
              className="rounded-full shadow-sm shadow-white w-[60px] aspect-square"
              src={user?.image || "/assets/defaults/teamImage.jpg"}
              alt="Team Image"
            />
            <span className=" text-2xl text-white">
              {capitalize(user.userName)} - {user.team?.name}
            </span>
            <UpdateTeamDialog
              organizationId={user.team?.organization.id}
              defaultValue={user.teamId as string}
              onChange={onUpdateTeam}
            />
            <div className="ml-auto">
              <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                onUpdate={(values) => {
                  const { from, to } = values.range;
                  if (!from || !to) return;
                  if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                    toast.error(
                      `The selected date range od to big. Max allowed range is ${MAX_DATE_RANGE_DAYS}`
                    );
                    return;
                  }
                  setDateRange({ from, to });
                }}
                showCompare={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        {data.map((item) => (
          <SkeletonWrapper isLoading={userFetching}>
            <CardCountUp
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          </SkeletonWrapper>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SkeletonWrapper isLoading={userFetching}>
          <CardLayout title="Profile" icon={User}>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p>Organization</p>
                <Input
                  disabled
                  placeholder="Organization"
                  value={user?.team?.organization.name}
                />
              </div>
              <div>
                <p>First Name</p>
                <Input
                  disabled
                  placeholder="Organization"
                  value={user?.firstName}
                />
              </div>
              <div>
                <p>Last Name</p>
                <Input
                  disabled
                  placeholder="Organization"
                  value={user?.lastName}
                />
              </div>
              <div className="group">
                <div className="flex justify-between items-center">
                  <p>Role</p>
                  <UpdateRoleDialog
                    defaultValue={user.role}
                    onChange={onUpdateRole}
                  />
                </div>
                <Input disabled placeholder="Role" value={user?.role} />
              </div>
              <div className="group">
                <div className="flex justify-between items-center">
                  <p>Account Status</p>
                  <UpdateAccountStatusDialog
                    defaultValue={user.accountStatus}
                    onChange={onUpdateAccountStatus}
                  />
                </div>
                <Input
                  disabled
                  placeholder="Account Status"
                  value={user?.accountStatus}
                />
              </div>
            </div>
          </CardLayout>
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={userFetching}>
          <PhoneNumbersCard phoneNumbers={user.phoneNumbers} />
        </SkeletonWrapper>
      </div>
    </>
  );
};
