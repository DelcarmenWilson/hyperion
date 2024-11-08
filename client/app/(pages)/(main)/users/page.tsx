"use client";

import { useUserData } from "@/hooks/user/use-user";

import { columns } from "./components/columns";
import { DataTable } from "@/components/tables/data-table";
import { UserTopMenu } from "./components/top-menu";
import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const UsersPage = () => {
  const { users, isFetchingUsers } = useUserData();
  return (
    <PageLayoutAdmin
      title={`Users (${users ? users.length : 0})`}
      description="Manage all users"
      topMenu={<UserTopMenu />}
    >
      <SkeletonWrapper isLoading={isFetchingUsers}>
        <DataTable columns={columns} data={users || []} headers />
      </SkeletonWrapper>
    </PageLayoutAdmin>
  );
};

export default UsersPage;
