import { useQuery } from "@tanstack/react-query";
import { FullUserCarrier } from "@/types";
import {
  getUserCarriers,
} from "@/actions/user/carrier";

export const useCarriers = () => {
  const { data: carriers, isFetching: isFetchingCarriers } = useQuery<
  FullUserCarrier[]
  >({
    queryFn: () => getUserCarriers(),
    queryKey: [`select-carriers`],
  });

  return {
    carriers,  isFetchingCarriers
  };
};
