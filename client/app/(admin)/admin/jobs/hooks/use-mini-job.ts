import { useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useJobStore } from "./use-store";
import { useJobId } from "./use-job";

import { toast } from "sonner";
import {  MiniJob } from "@prisma/client";
import { MiniJobSchemaType } from "@/schemas/job";
import { PrevNext } from "@/types/general";

import {
  miniJobDeleteById,
  miniJobGetById,
  miniJobGetPrevNextById,
  miniJobInsert,
  miniJobsGetAll,
  miniJobsGetAllByJobId,
  miniJobUpdateById,
} from "@/actions/developer/mini-job";

export const useMiniJobData = () => {
  const { jobId } = useJobId();
  const { miniJobId } = useMiniJobId();

  //MINI JOBS
  // const { data: miniJobs, isFetching: isFetchingMiniJobs } = useQuery<MiniJob[] | []>({
  //   queryFn: () => miniJobsGetAll(),
  //   queryKey: ["mini-jobs"],
  // });

  const { data: miniJobs, isFetching: isFetchingMiniJobs } = useQuery<
    MiniJob[] | []
  >({
    queryFn: () => miniJobsGetAllByJobId(jobId),
    queryKey: [`mini-jobs-${jobId}`],
  });

  //MINI JOB
  const { data: miniJob, isFetching: isFetchingMiniJob } =
    useQuery<MiniJob | null>({
      queryFn: () => miniJobGetById(miniJobId),
      queryKey: [`mini-job-${miniJobId}`],
    });
  //MINI JOB PREV NEXT
  const { data: miniJobPrevNext, isFetching: isFetchingMiniJobPrevNext } =
    useQuery<PrevNext>({
      queryFn: () => miniJobGetPrevNextById(jobId),
      queryKey: [`mini-job-prev-next-${jobId}`],
    });
  return {
    miniJobs,
    isFetchingMiniJobs,
    miniJob,
    isFetchingMiniJob,
    miniJobPrevNext,
    isFetchingMiniJobPrevNext,
  };
};

export const useMiniJobActions = () => {
  const { onJobFormClose } = useJobStore();
  const { jobId } = useJobId();
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };

  //MINI JOB DELETE
  const { mutate: miniJobDeleteMutate, isPending: miniJobDeleting } =
    useMutation({
      mutationFn: miniJobDeleteById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Mini Job deleted!!!", { id: "delete-mini-job" });
          onJobFormClose();
          invalidate(`mini-jobs-${jobId}`);
        } else {
          toast.error(results.error, { id: "delete-mini-job" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMiniJobDelete = useCallback(
    (id: string) => {
      toast.loading("Deleting Mini Job...", { id: "delete-mini-job" });
      miniJobDeleteMutate(id);
    },
    [miniJobDeleteMutate]
  );

  //MINI JOB INSERT
  const { mutate: miniJobInsertMutate, isPending: miniJobInserting } =
    useMutation({
      mutationFn: miniJobInsert,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Mini Job created!!!", { id: "insert-mini-job" });
          onJobFormClose();
          invalidate(`mini-jobs-${jobId}`);
        } else {
          toast.error(results.error, { id: "insert-mini-job" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMiniJobInsert = useCallback(
    (values: MiniJobSchemaType) => {
      toast.loading("Creating new mini Job...", {
        id: "insert-mini-job",
      });
      values.jobId = jobId;
      miniJobInsertMutate(values);
    },
    [miniJobInsertMutate]
  );

  //MINI JOB UPDATE
  const { mutate: miniJobUpdateMutate, isPending: miniJobUpdating } =
    useMutation({
      mutationFn: miniJobUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Job Updated!!!", { id: "update-mini-job" });
          onJobFormClose();
          invalidate(`mini-jobs-${jobId}`);
        } else {
          toast.error(results.error, { id: "update-mini-job" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMiniJobUpdate = useCallback(
    (values: MiniJobSchemaType) => {
      toast.loading("Updating new Job...", { id: "update-mini-job" });
      miniJobUpdateMutate(values);
    },
    [miniJobUpdateMutate]
  );

  return {
    onMiniJobDelete,
    miniJobDeleting,
    onMiniJobInsert,
    miniJobInserting,
    onMiniJobUpdate,
    miniJobUpdating,
  };
};

export const useMiniJobId = () => {
  const params = useParams();
  const miniJobId = useMemo(() => {
    if (!params?.minijobid) return "";

    return params?.minijobid as string;
  }, [params?.id]);

  return useMemo(() => ({ miniJobId }), [miniJobId]);
};
