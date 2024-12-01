"use client"
import { getUserProfile } from "@/actions/user/profile";
import { UserProfile } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export const useProfile = () => {
  const onGetProfile = (userId: string,dateRange:DateRange) => {
    const {
      data: user,
      isFetching: userFetching,
      isLoading: userLoading,
    } = useQuery<UserProfile | null>({
      queryFn: () => getUserProfile({id:userId,dateRange}),
      queryKey: [`user-profile-${userId}`,dateRange.from,dateRange.to],
    });

    return {
      user,
      userFetching,
      userLoading,
    };
  };

  return {
    onGetProfile,
  };
};
