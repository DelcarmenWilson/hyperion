import { useUserData } from "@/hooks/user/use-user";
import { UserCard } from "@/components/user/card";
import Loader from "@/components/reusable/loader";

type ChatUsersListProps = {
  onSelectUser: (e: string) => void;
  loading?: boolean;
};

export const ChatUsersList = ({
  onSelectUser,
  loading,
}: ChatUsersListProps) => {
  const { onSiteUserGet } = useUserData();
  const { siteUsers, siteUsersFetching } = onSiteUserGet();

  return (
    <div className="flex flex-1 flex-col gap-2 h-full overflow-hidden">
      {siteUsersFetching || loading ? (
        <Loader text="Loading Users..." />
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {siteUsers?.map((user) => (
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
