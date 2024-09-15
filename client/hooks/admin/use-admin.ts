import { PageUpdate } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  pageUpdateInsert,
  pageUpdatesGetAll,
} from "@/actions/admin/page-update";
import { useState } from "react";
import { toast } from "sonner";
import { PageUpdateSchemaType } from "@/schemas/admin";
import { handleFileUpload } from "@/lib/utils";

export const useAdminData = (onClose?: () => void) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["adminPageUpdates"],
    });
  };
  const { data: pageUpdates, isFetching: isPageUpdatesFetching } = useQuery<
    PageUpdate[]
  >({
    queryKey: ["adminPageUpdates"],
    queryFn: () => pageUpdatesGetAll(),
  });

  const onPageUpdatedInsert = async (values: PageUpdateSchemaType,image?:File|null) => {
    setLoading(true);
    if (image) {
      values.image = await handleFileUpload({
        newFile: image,
        filePath: "page-updates",
      });
    }
    const insertedUpdate = await pageUpdateInsert(values);
    if (insertedUpdate.success) {
      if (onClose) onClose();
      invalidate();
      toast.success("Update created!");
    } else toast.error(insertedUpdate.error);
    setLoading(false);
  };
  return {
    loading,
    invalidate,
    pageUpdates,
    isPageUpdatesFetching,
    onPageUpdatedInsert,
  };
};
