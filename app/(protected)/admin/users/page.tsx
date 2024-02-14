import { userGetAll } from "@/data/user";
import { UserClient } from "./components/client";
import { Heading } from "@/components/custom/heading";

const UsersPage = async () => {
  const users = await userGetAll();
  return (
    <>
      <Heading
        title={`Users (${users.length})`}
        description="Manage all users"
      />
      <UserClient users={users} />
    </>
  );
};

export default UsersPage;
