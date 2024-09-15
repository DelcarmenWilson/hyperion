"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataTable } from "../tables/data-table";
import { columns } from "./columns";
import { formatSecondsToTime } from "@/formulas/numbers";
import { useLoginStatus, useLoginStatusData } from "@/hooks/use-login-status";
import SkeletonWrapper from "../skeleton-wrapper";

export const LoginStatusModal = () => {
  const {
    user,
    isLoginStatusOpen: isLoginStausOpen,
    onLoginStatusClose: onLoginStausClose,
  } = useLoginStatus();
  const { onloginStatusGetAllByUserId } = useLoginStatusData(user?.id!);
  const { logins, loginsIsFetching } = onloginStatusGetAllByUserId();

  const totalDuration = logins?.reduce((sum, login) => login.duration + sum, 0);
  if (!user) return null;
  return (
    <Dialog open={isLoginStausOpen} onOpenChange={onLoginStausClose}>
      <DialogDescription className="hidden">
        Login Status Form
      </DialogDescription>
      <DialogContent className="max-h-[96%] max-w-[70%]">
        <h3 className="text-2xl font-semibold py-2">
          Logins -{" "}
          <span className="text-primary">
            {user.firstName} {user.lastName}
          </span>
        </h3>
        <SkeletonWrapper isLoading={loginsIsFetching}>
          <DataTable
            topMenu={
              <div className="flex justify-end items-center">
                Total Time -{" "}
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
      </DialogContent>
    </Dialog>
  );
};
