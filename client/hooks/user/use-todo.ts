import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserTodo } from "@prisma/client";


import { userTodoGetAll } from "@/actions/user/todo";

type State = {
  todo?: UserTodo;
  isTodosModalOpen: boolean;
   isTodoInfoOpen: boolean;
  // isTodoFormOpen: boolean;
};

type Actions = {
  setTodo:(t:UserTodo)=>void
  onTodosModalOpen: () => void;
  onTodosModalClose: () => void;
  onTodoInfoOpen: (t:UserTodo) => void;
  onTodoInfoClose: () => void;
  // onTodoFormOpen: (t:UserTodo) => void;
  // onTodoFormClose: () => void;
};

export const useTodoStore = create<State & Actions>((set) => ({
  isTodosModalOpen: false,
  onTodosModalOpen: () => set({isTodosModalOpen: true}),
  onTodosModalClose: () => set({isTodosModalOpen: false}),
  isTodoInfoOpen:false,
  setTodo:(t)=> set({todo: t }),
  onTodoInfoOpen: (t) => set({isTodoInfoOpen: true,todo:t }),
  onTodoInfoClose: () => set({isTodoInfoOpen: false,todo:undefined}),
  // isTodoFormOpen: false,
  // setTodo:(t)=> set({todo: t }),
  // onTodoFormOpen: (t) => set({isTodoFormOpen: true,todo:t }),
  // onTodoFormClose: () => set({isTodoFormOpen: false,todo:undefined}),
}));

export const useTodoData = () => {
  const { data: todos, isFetching: isFetchingTodo } =
    useQuery<UserTodo[] | []>({
      queryFn: () => userTodoGetAll(),
      queryKey: ["todos"],
    }); 

  return {
    todos, isFetchingTodo
  };
};

// export const useBluePrintActions = () => {
//   const { onBluePrintWeekFormClose,onWorkInfoFormClose } = useBluePrintStore();
//   const queryClient = useQueryClient();

//   const invalidate = (key: string) => {
//     queryClient.invalidateQueries({ queryKey: [key] });
//   };
//   //AGENT WORK INFO INSERT
//   const {
//     mutate: agentWorkInfoInsertMutate,
//     isPending: agentWorkInfoInserting,
//   } = useMutation({
//     mutationFn: agentWorkInfoInsert,
//     onSuccess: (results) => {
//       if (results.success) {
//         toast.success("Agent details have been created", {
//           id: "insert-agent-work-info",
//         });
//         onWorkInfoFormClose();
//         [
//           "agent-work-info",
//           "agent-blueprints",
//           "agent-blueprints-weekly",
//           "agent-blueprint-week-active",
//           "agent-blue-print-active",
//         ].forEach((key) => invalidate(key));
//       } else {
//         toast.error(results.error, { id: "insert-agent-work-info" });
//       }
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const onAgentWorkInfoInsert = useCallback(
//     (values: AgentWorkInfoSchemaType) => {
//       toast.loading("Creating Work Info...", { id: "insert-agent-work-info" });
//       agentWorkInfoInsertMutate(values);
//     },
//     [agentWorkInfoInsertMutate]
//   );

//   //AGENT WORK INFO UPDATE
//   const {
//     mutate: agentWorkInfoUpdateMutate,
//     isPending: agentWorkInfoUpdating,
//   } = useMutation({
//     mutationFn: agentWorkInfoUpdateByUserId,
//     onSuccess: (results) => {
//       if (results.success) {
//         invalidate("agent-full-time-info");
//         onWorkInfoFormClose();
//         toast.success("Agent details have been updated", {
//           id: "update-agent-work-info",
//         });
//       } else {
//         toast.error(results.error, { id: "update-agent-work-info" });
//       }
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const onAgentWorkInfoUpdate = useCallback(
//     (values: AgentWorkInfoSchemaType) => {
//       toast.loading("Updating Work Info...", { id: "update-agent-work-info" });
//       agentWorkInfoUpdateMutate(values);
//     },
//     [agentWorkInfoUpdateMutate]
//   );

  
// //BLUE PRINT WEEK UPDATE
//   const {
//     mutate: bluePrintWeekUpdateMutate,
//     isPending: bluePrintWeekUpdating,
//   } = useMutation({
//     mutationFn: bluePrintWeekUpdateById,
//     onSuccess: (results) => {
//       if (results.success) {
//         invalidate("agent-blueprint-week-active");
//          onBluePrintWeekFormClose();
//         toast.success("Blue Print details updated", {
//           id: "update-blueprint-week",
//         });
//       } else {
//         toast.error(results.error, { id: "update-blueprint-week" });
//       }
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const onBluePrintWeekUpdate = useCallback(
//     (values: BluePrintWeekSchemaType) => {
//       toast.loading("Updating Blueprint Week...", {
//         id: "update-blueprint-week",
//       });
//       bluePrintWeekUpdateMutate(values);
//     },
//     [bluePrintWeekUpdateMutate]
//   );
  

//   //Calculate Next Week BluePrint
//   //TODO - change this to use mutate
//   const onCalculateBlueprintTargets = async () => {
//     createWeeklyBlueprint();
//     [
//       "agent-work-info",
//       "agent-blueprints",
//       "agent-blueprints-weekly",
//       "agent-blueprint-week-active",
//       "agent-blueprint-active",
//     ].forEach((key) => invalidate(key));
//   };

//   return {
//     onAgentWorkInfoInsert,
//     agentWorkInfoInserting,
//     onAgentWorkInfoUpdate,
//     agentWorkInfoUpdating,
//     onBluePrintWeekUpdate,
//     bluePrintWeekUpdating,
//     onCalculateBlueprintTargets,
//   };
// };
