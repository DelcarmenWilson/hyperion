"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, DollarSign, MessageCircle, Phone, User } from "lucide-react";

import { capitalize } from "@/formulas/text";
import { format } from "date-fns";
import { Team } from "@prisma/client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CardCountUp } from "@/components/custom/card-count-up";
import { FullUserReport } from "@/types";
import { CardLayout } from "@/components/custom/card-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoles } from "@/constants/user";
import { adminChangeTeam, adminChangeUserRole } from "@/actions/admin";
import { toast } from "sonner";
import { USDollar } from "@/formulas/numbers";

type UserClientProps = {
  user: FullUserReport;
  teams: Team[];
};

export const UserClient = ({ user, teams }: UserClientProps) => {
  const router = useRouter();
  const ap = user.leads.reduce((sum, lead) => sum + lead.saleAmount, 0);
  const data = [
    {
      title: "Calls",
      value: user.calls.length.toString(),
      icon: <Phone />,
    },
    {
      title: "Conversations",
      value: user.conversations.length.toString(),
      icon: <MessageCircle />,
    },
    {
      title: "Appointments",
      value: user.appointments.length.toString(),
      icon: <Calendar />,
    },
    {
      title: "Annual Premuim",
      value: USDollar.format(ap),
      icon: <DollarSign />,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(user.teamId!);
  const [role, setRole] = useState(user.role.toString());

  const onRoleChange = () => {
    if (!role) return;
    setLoading(true);
    adminChangeUserRole(user.id, role).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
      setLoading(false);
    });
  };

  const onTeamChange = () => {
    if (!team) return;
    setLoading(true);
    adminChangeTeam(user.id, team).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
      setLoading(false);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="w-full relative h-[100px] text-center group">
          <Image
            width={200}
            height={100}
            className="h-full w-full"
            src={"/assets/defaults/teamBanner.jpg"}
            alt="Team Banner"
          />
          <div className="absolute flex items-center gap-4 top-0 left-0 w-full h-full text-white p-4">
            <Image
              width={60}
              height={60}
              className="rounded-full shadow-sm shadow-white w-[60px] aspect-square"
              src={user?.image || "/assets/defaults/teamImage.jpg"}
              alt="Team Image"
            />
            <span className=" text-2xl">
              {capitalize(user?.userName)} - {user?.team?.name}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="opacity-0 group-hover:opacity-100"
                    variant="link"
                    size="sm"
                  >
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4 max-h-[96%] max-w-max bg-background">
                  <h3 className="text-2xl font-semibold py-2">Change Team</h3>
                  <div>
                    <p className="text-muted-foreground">Select a New Team</p>

                    <Select
                      name="ddlTeam"
                      disabled={loading}
                      onValueChange={setTeam}
                      defaultValue={team}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    disabled={user.teamId == team || loading}
                    onClick={onTeamChange}
                  >
                    Change
                  </Button>
                </DialogContent>
              </Dialog>
            </span>
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 my-4">
        {data.map((d) => (
          <CardCountUp
            key={d.title}
            title={d.title}
            value={d.value}
            icon={d.icon}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
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
              <p>
                Role
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="opacity-0 group-hover:opacity-100"
                      variant="link"
                      size="sm"
                    >
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-4 max-h-[96%] max-w-max bg-background">
                    <h3 className="text-2xl font-semibold py-2">Change Role</h3>
                    <div>
                      <p className="text-muted-foreground">Select a New Role</p>

                      <Select
                        name="ddlRole"
                        disabled={loading}
                        onValueChange={setRole}
                        defaultValue={role}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {UserRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      disabled={user.role == role || loading}
                      onClick={onRoleChange}
                    >
                      Change
                    </Button>
                  </DialogContent>
                </Dialog>
              </p>
              <Input disabled placeholder="Organization" value={user?.role} />
            </div>
          </div>
        </CardLayout>
        <CardLayout title="Phone Numbers" icon={Phone}>
          <p className="col-span-3 text-center">Phone Numbers</p>
          <div className="grid grid-cols-4 gap-2">
            <span>Phone</span>
            <span>State</span>
            <span>Status</span>
            <span>Renewal Date</span>
            {user.phoneNumbers.map((number) => (
              <>
                <span>{number.phone}</span>
                <span>{number.state}</span>
                <span>{number.status}</span>
                <span>{format(number.renewAt, "MM/dd/yyy")}</span>
              </>
            ))}
          </div>
        </CardLayout>
      </div>
      <Separator />
    </>
  );
};
