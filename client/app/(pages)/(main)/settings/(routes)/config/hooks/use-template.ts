import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";
import { toast } from "sonner";

import { UserTemplateSchemaType } from "@/schemas/user";
import { UserTemplate } from "@prisma/client";

import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
} from "@/actions/user/template";

export const useAgentTemplateData = () => {
  const { data: templates, isFetching: isFetchingTemplates } = useQuery<
    UserTemplate[]
  >({
    queryFn: () => getTemplates(),
    queryKey: ["agent-templates"],
  });

  return {
    templates,
    isFetchingTemplates,
  };
};

export const useAgentTemplateActions = (cb?: () => void) => {
  const { invalidate } = useInvalidate();

  // DELETE TEMPLATE
  const { mutate: deleteTemplateMutate, isPending: templateDeleting } =
    useMutation({
      mutationFn: deleteTemplate,
      onSuccess: () => {
        toast.success("Template deleted", {
          id: "delete-template",
        });
        invalidate("agent-templates");
      },
      onError: (error) => {
        toast.error(error.message, {
          id: "delete-template",
        });
      },
    });
  const onDeleteTemplate = useCallback(
    (id: string) => {
      toast.loading("Deleting template...", { id: "delete-template" });
      deleteTemplateMutate(id);
    },
    [deleteTemplateMutate]
  );

  //CREATE CARIIER
  const { mutate: createTemplateMutate, isPending: templateCreating } =
    useMutation({
      mutationFn: createTemplate,
      onSuccess: () => {
        if (cb) cb();
        toast.success("Template created!", {
          id: "create-template",
        });
        invalidate("agent-templates");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "create-template",
        }),
    });

  const onCreateTemplate = useCallback(
    (values: UserTemplateSchemaType) => {
      toast.loading("Creating new template...", {
        id: "create-template",
      });
      createTemplateMutate(values);
    },
    [createTemplateMutate]
  );
  //UPDATE CARIIER
  const { mutate: updateTemplateMutate, isPending: templateUpdating } =
    useMutation({
      mutationFn: updateTemplate,
      onSuccess: () => {
        if (cb) cb();
        toast.success("Template created!", {
          id: "update-template",
        });
        invalidate("agent-templates");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "update-template",
        }),
    });
  const onUpdateTemplate = useCallback(
    (values: UserTemplateSchemaType) => {
      toast.loading("Updating template...", { id: "update-template" });
      updateTemplateMutate(values);
    },
    [updateTemplateMutate]
  );

  return {
    onDeleteTemplate,
    templateDeleting,
    onCreateTemplate,
    templateCreating,
    onUpdateTemplate,
    templateUpdating,
  };
};
