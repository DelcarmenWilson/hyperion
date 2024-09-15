import { useQuery } from "@tanstack/react-query";
import { FullUserCarrier } from "@/types";
import {
  userCarriersGetAll,
} from "@/actions/user/carrier";

export const useCarriers = () => {
  const { data: carriers, isFetching: isFetchingCarriers } = useQuery<
  FullUserCarrier[]
  >({
    queryFn: () => userCarriersGetAll(),
    queryKey: [`select-carriers`],
  });

  return {
    carriers,  isFetchingCarriers
  };
};
