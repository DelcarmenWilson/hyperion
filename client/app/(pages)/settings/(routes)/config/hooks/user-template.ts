import { userTemplateDeleteById, userTemplatesGetAll } from "@/actions/user/template";
import { UserTemplate } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useAgentTemplateData = () => {    
  
    const { data: templates, isFetching: isFetchingTemplates } =
      useQuery<UserTemplate[] >({
        queryFn: () => userTemplatesGetAll(),
        queryKey: ["agent-templates"],
      });   
  
    return {
        templates,  isFetchingTemplates
    };
  };

  export const useAgentTemplateActions = () => {
    const queryClient = useQueryClient();
    const [alertOpen, setAlertOpen] = useState(false);
  
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates`"] });
    };
  
    const { mutate: templateDelete, isPending: isPendingTemplateDelete } =
      useMutation({
        mutationFn: userTemplateDeleteById,
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Template deleted", {
              id: "delete-agent-template",
            });
            invalidate();
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    const onTemplateDelete = useCallback(
      (id: string) => {
        toast.loading("Updating License...", { id: "delete-agent-template" });
  
        templateDelete(id);
      },
      [templateDelete]
    );
  
    return { alertOpen, setAlertOpen, onTemplateDelete, isPendingTemplateDelete };
  };