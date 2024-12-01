import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateJobSchemaType, UpdateJobSchemaType } from "@/schemas/job";

import { createJob,deleteJob,updateJob } from "@/actions/developer/job";

export const useJobActions = () => {
  //JOB DELETE
  const { mutate: jobDeleteMutate, isPending: jobDeleting } = useMutation({
    mutationFn: deleteJob,
    onSuccess: (results) => {
      if (results?.error) {
        toast.error(results.error, { id: "delete-job" });
      } else {
        toast.success("job deleted succesfully", { id: "delete-job" });
      }
    },
    onError: (error) => {
      toast.error(error.message, { id: "delete-job" });
    },
  });

  const onJobDelete = useCallback(
    (id: string) => {
      toast.loading("Deleting Job...", { id: "delete-job" });
      jobDeleteMutate(id);
    },
    [jobDeleteMutate]
  );

  //JOB INSERT
  const { mutate: jobInsertMutate, isPending: jobInserting } = useMutation({
    mutationFn: createJob,
    onSuccess: (results) =>
      toast.success("Job created!!", { id: "insert-job" }),

    onError: (error) => toast.error(error.message, { id: "insert-job" }),
  });

  const onJobInsert = useCallback(
    (values: CreateJobSchemaType) => {
      toast.loading("Creating new Job...", {
        id: "insert-job",
      });
      jobInsertMutate(values);
    },
    [jobInsertMutate]
  );

  //JOB UPDATE
  const { mutate: jobUpdateMutate, isPending: jobUpdating } = useMutation({
    mutationFn: updateJob,
    onSuccess: (results) =>
      toast.success("Job Updated!!!", { id: "update-job" }),
    onError: (error) => toast.error(error.message, { id: "update-job" }),
  });

  const onJobUpdate = useCallback(
    (values: UpdateJobSchemaType) => {
      toast.loading("Updating new Job...", { id: "update-job" });
      jobUpdateMutate(values);
    },
    [jobUpdateMutate]
  );

  return {
    onJobDelete,
    jobDeleting,
    onJobInsert,
    jobInserting,
    onJobUpdate,
    jobUpdating,
  };
};

export const useJobId = () => {
  const params = useParams();
  const jobId = useMemo(() => {
    if (!params?.jobId) return "";

    return params?.jobId as string;
  }, [params?.jobId]);

  return useMemo(() => ({ jobId }), [jobId]);
};
