import { useQueryClient } from "@tanstack/react-query";

export const useInvalidate = () => {
  const queryClient = useQueryClient();

  const invalidate = (key: string ) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  const invalidateMultiple = (keys: string[]) => {
    keys.forEach(key=>queryClient.invalidateQueries({ queryKey: [key] }))
    
  };
  return { invalidate,invalidateMultiple };
};
