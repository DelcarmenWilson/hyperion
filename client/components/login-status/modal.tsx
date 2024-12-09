"use client";
import React from "react";
import { useLoginStatus, useLoginStatusData } from "@/hooks/use-login-status";

import { CustomDialog } from "../global/custom-dialog";
import { columns } from "./columns";
import { DataTable } from "../tables/data-table";
import SkeletonWrapper from "../skeleton-wrapper";

import { formatSecondsToTime } from "@/formulas/numbers";

export const LoginStatusModal = () => {
  const {
    user,
    isLoginStatusOpen: isLoginStausOpen,
    onLoginStatusClose: onLoginStausClose,
  } = useLoginStatus();
  const { onGetLoginsForUser } = useLoginStatusData(user?.id!);
  const { logins, loginsFetching } = onGetLoginsForUser();

  const totalDuration = logins?.reduce((sum, login) => login.duration + sum, 0);
  if (!user) return null;
  return (
    <CustomDialog
      open={isLoginStausOpen}
      onClose={onLoginStausClose}
      title="Logins"
      subTitle={`${user.firstName} ${user.lastName}`}
      description="Login Status Form"
    >
      <SkeletonWrapper isLoading={loginsFetching}>
        <DataTable
          topMenu={
            <div className=" col-span-3 flex justify-end items-center gap-2">
              Total Time -
              <span className="text-primary font-bold">
                {formatSecondsToTime(totalDuration)}
              </span>
            </div>
          }
          columns={columns}
          data={logins || []}
          striped
          headers
        />
      </SkeletonWrapper>
    </CustomDialog>
  );
};
