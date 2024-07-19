import { useEffect, useState } from "react";

import { User } from "@prisma/client";
import axios from "axios";
import { UserCard } from "@/components/user/card";
import Loader from "@/components/reusable/loader";

type ChatUsersListProps = {
  onSelectUser: (e: string) => void;
};

export const ChatUsersList = ({ onSelectUser }: ChatUsersListProps) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    axios
      .post("/api/user/users", { role: "all" })
      .then((response) => {
        const data = response.data as User[];
        setUsers(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-2 h-full overflow-hidden">
      {loading ? (
        <Loader text="Loading Users..." />
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {users?.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              setSelectedUser={(e) => onSelectUser(e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
