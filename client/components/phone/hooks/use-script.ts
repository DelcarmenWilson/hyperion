import { useQuery } from "@tanstack/react-query";
import { Script } from "@prisma/client";
import { scriptGetOne } from "@/actions/script";

export const useScriptData = () => {
  const { data: script, isFetching: isFetchingScript } =
    useQuery<Script | null>({
      queryFn: () => scriptGetOne(),
      queryKey: ["agent-script"],
    });

  return {
    script,
    isFetchingScript,
  };
};