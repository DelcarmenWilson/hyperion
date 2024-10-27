import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useJobStore } from "./use-store";

import { toast } from "sonner";
import { Job } from "@prisma/client";
import { JobSchemaType } from "@/schemas/job";
import { PrevNext } from "@/types/general";

import {
  jobInsert,
  jobsGetAll,
  jobGetById,
  jobGetPrevNextById,
  jobUpdateById,
  jobDeleteById,
} from "@/actions/developer/job";

export const useJobData = () => {
  const { jobId } = useJobId();
  //JOBS
  const { data: jobs, isFetching: isFetchingJobs } = useQuery<Job[] | []>({
    queryFn: () => jobsGetAll(),
    queryKey: ["jobs"],
  });

  //JOB
  const { data: job, isFetching: isFetchingJob } = useQuery<Job | null>({
    queryFn: () => jobGetById(jobId),
    queryKey: [`job-${jobId}`],
  });
  //JOB
  const { data: jobPrevNext, isFetching: isFetchingJobPrevNext } =
    useQuery<PrevNext>({
      queryFn: () => jobGetPrevNextById(jobId),
      queryKey: [`job-prev-next-${jobId}`],
    });
  return {
    jobs,
    isFetchingJobs,
    job,
    isFetchingJob,
    jobPrevNext,
    isFetchingJobPrevNext,
  };
};

export const useJobActions = () => {
  const { onJobFormClose } = useJobStore();
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };

  //JOB DELETE
  const { mutate: jobDeleteMutate, isPending: jobDeleting } = useMutation({
    mutationFn: jobDeleteById,
    onSuccess: (results) => {
      if (results.success) {
        toast.success(results.success, { id: "delete-job" });
        onJobFormClose();
        invalidate("jobs");
      } else {
        toast.error(results.error, { id: "delete-job" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
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
    mutationFn: jobInsert,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Job created!!!", { id: "insert-job" });
        onJobFormClose();
        invalidate("jobs");
      } else {
        toast.error(results.error, { id: "insert-job" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onJobInsert = useCallback(
    (values: JobSchemaType) => {
      toast.loading("Creating new Job...", {
        id: "insert-job",
      });
      jobInsertMutate(values);
    },
    [jobInsertMutate]
  );

  //JOB UPDATE
  const { mutate: jobUpdateMutate, isPending: jobUpdating } = useMutation({
    mutationFn: jobUpdateById,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Job Updated!!!", { id: "update-job" });
        onJobFormClose();
        invalidate("jobs");
        invalidate(`job-${results.success.id}`);
      } else {
        toast.error(results.error, { id: "update-job" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onJobUpdate = useCallback(
    (values: JobSchemaType) => {
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
    if (!params?.id) return "";

    return params?.id as string;
  }, [params?.id]);

  return useMemo(() => ({ jobId }), [jobId]);
};
