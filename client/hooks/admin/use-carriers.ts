import { useQuery } from "@tanstack/react-query";
import { Carrier } from "@prisma/client";
import { adminCarriersGetAll } from "@/actions/admin/carrier";

export const useAdminCarriers = () => {
  const { data: carriers, isFetching: isFetchingCarriers } = useQuery<
    Carrier[]
  >({
    queryFn: () => adminCarriersGetAll(),
    queryKey: ["admin-carriers"],
  });

  return {
    carriers,
    isFetchingCarriers,
  };
};
