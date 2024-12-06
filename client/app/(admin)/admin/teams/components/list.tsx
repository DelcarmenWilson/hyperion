"use client";
import { User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { FullTeam } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardData } from "@/components/reusable/card-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCard } from "./user-card";
import { formatDate } from "@/formulas/dates";

type TeamListProps = {
  teams: FullTeam[];
  size?: string;
};
export const TeamList = ({ teams, size = "full" }: TeamListProps) => {
  return (
    <>
      {teams.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-2"
          )}
        >
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Teams Found</p>
        </div>
      )}
    </>
  );
};

const TeamCard = ({ team }: { team: FullTeam }) => {
  return (
    <Card className="flex flex-col hover:bg-accent">
      <CardHeader>
        <CardTitle className="text-2xl text-primary font-semibold text-center hover:bg-primary hover:text-background">
          <Link href={`/admin/teams/${team.id}`}>{team.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 border rounded-xl p-2 overflow-hidden text-sm h-[225px] gap-2">
        <div className="space-y-2">
          <div className="flex-center flex-col text-sm gap-1">
            <h4 className="text-muted-foreground">Owner</h4>
            <Avatar>
              <AvatarImage src={team.owner?.image || ""} />
              <AvatarFallback className="bg-primary">
                <User className="text-accent" />
              </AvatarFallback>
            </Avatar>
            <h4 className="font-bold">{team.owner?.firstName!}</h4>
          </div>
          <CardData label="Image" value={team.logo!} />
          <CardData label="Banner" value={team.banner!} />

          <CardData label="Organization" value={team.organization.name} />
          <CardData label="Date Created" value={formatDate(team.createdAt)} />
          <CardData label="Date Updated" value={formatDate(team.updatedAt)} />
        </div>

        {team.userId.length > 0 && (
          <div className="flex-1 flex flex-col h-full overflow-hidden shadow-sm p-2">
            <h4 className="flex justify-between items-center text-lg font-semibold">
              Users
              <span>{team.users?.length}</span>
            </h4>
            <ScrollArea>
              <div className="flex-1 h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden pe-2">
                {team.users?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      {/* <CardFooter className="flex group gap-2 justify-end items-center mt-auto">
          <DeleteDialog
            title="Are your sure you want to delete this carrier?"
            btnClass="opacity-0 group-hover:opacity-100 w-fit"
            cfText={carrier.carrier.name}
            onConfirm={() => onDeleteCarrier(carrier.id)}
            loading={carrierDeleting}
          />
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </CardFooter> */}
    </Card>
  );
};
