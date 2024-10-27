import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";

import { toast } from "sonner";
import { Job } from "@prisma/client";
import { JobSchemaType, MiniJobSchemaType } from "@/schemas/job";
import { PrevNext } from "@/types/general";

import {
  jobInsert,
  jobsGetAll,
  jobGetById,
  jobGetPrevNextById,
  jobUpdateById,
} from "@/actions/developer/job";

import { miniJobInsert, miniJobUpdateById } from "@/actions/developer/mini-job";

type State = {
  jobFormIsOpen: boolean;
  miniJobFormIsOpen: boolean;
};
type Actions = {
  onJobFormOpen: () => void;
  onJobFormClose: () => void;
  onMiniJobFormOpen: () => void;
  onMiniJobFormClose: () => void;
};

export const useJobStore = create<State & Actions>((set) => ({
  jobFormIsOpen: false,
  onJobFormOpen: () => set({ jobFormIsOpen: true }),
  onJobFormClose: () => set({ jobFormIsOpen: false }),
  miniJobFormIsOpen: false,
  onMiniJobFormOpen: () => set({ miniJobFormIsOpen: true }),
  onMiniJobFormClose: () => set({ miniJobFormIsOpen: false }),
}));

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

  //JOB INSERT
  const { mutate: jobInsertMutate, isPending: jobInsertIsPending } =
    useMutation({
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
  const { mutate: jobUpdateMutate, isPending: jobUpdateIsPending } =
    useMutation({
      mutationFn: jobUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Job Updated!!!", { id: "update-job" });
          onJobFormClose();
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
    onJobInsert,
    jobInsertIsPending,
    onJobUpdate,
    jobUpdateIsPending,
  };
};

export const useMiniJobActions = () => {
  const { onJobFormClose } = useJobStore();
  const {jobId}=useJobId()
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };

  //MINI JOB INSERT
  const { mutate: miniJobInsertMutate, isPending: miniJobInserting } =
    useMutation({
      mutationFn: miniJobInsert,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Mini Job created!!!", { id: "insert-mini-job" });
          onJobFormClose();
          invalidate(`job-${jobId}`);
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
      values.jobId=jobId
      miniJobInsertMutate(values);
    },
    [miniJobInsertMutate]
  );

  //JOB Update
  const { mutate: miniJobUpdateMutate, isPending: miniJobUpdating } =
    useMutation({
      mutationFn: miniJobUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Job Updated!!!", { id: "update-mini-job" });
          onJobFormClose();
          invalidate(`job-${jobId}`);
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
    onMiniJobInsert,
    miniJobInserting,
    onMiniJobUpdate,
    miniJobUpdating,
  };
};

export const useJobId = () => {
  const params = useParams();
  const jobId = useMemo(() => {
    if (!params?.id) {
      return "";
    }

    return params?.id as string;
  }, [params?.id]);

  return useMemo(() => ({ jobId }), [jobId]);
};
