import { userTemplatesGetAll } from "@/actions/user";
import { UserTemplate } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useTemplateData = () => {    
  
    const { data: templates, isFetching: isFetchingTemplates } =
      useQuery<UserTemplate[] >({
        queryFn: () => userTemplatesGetAll(),
        queryKey: ["user-templates"],
      });   
  
    return {
        templates,  isFetchingTemplates
    };
  };