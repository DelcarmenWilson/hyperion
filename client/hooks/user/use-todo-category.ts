import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";
import { toast } from "sonner";

import { UserTodoCategory } from "@prisma/client";
import { CreateCategorySchemaType } from "@/schemas/category";

import {
  createCategory,
  getCategories,
  getCategory,
} from "@/actions/user/category";

export const useTodoCategoryData = () => {
  const onGetCategories = () => {
    const {
      data: categories,
      isFetching: categoriesFetching,
      isLoading: categoriesLoading,
    } = useQuery<UserTodoCategory[]>({
      queryKey: ["todo-categories"],
      queryFn: () => getCategories(),
    });

    return { categories, categoriesFetching, categoriesLoading };
  };
  const onGetCategory = (id: string) => {
    const {
      data: category,
      isFetching: categoryFetching,
      isLoading: categoryLoading,
    } = useQuery<UserTodoCategory | null>({
      queryFn: () => getCategory(id),
      queryKey: [`todo-category-${id}`],
      enabled: !!id,
    });
    return { category, categoryFetching, categoryLoading };
  };

  return {
    onGetCategories,
    onGetCategory,
  };
};

export const useTodoCategoryActions = (
  cb: (category: UserTodoCategory) => void
) => {
  const { invalidate } = useInvalidate();

  const { mutate: createCategoryMutate, isPending: categoryCreating } =
    useMutation({
      mutationFn: createCategory,
      onSuccess: async (data: UserTodoCategory) => {
        toast.success(`Category ${data.name} created sucessfully`, {
          id: "create-category",
        });
        invalidate("todo-categories");
        cb(data);
      },
      onError: () => {
        toast.success("Something went wrong", {
          id: "create-category",
        });
      },
    });

  const onCreateCategory = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });
      createCategoryMutate(values);
    },
    [createCategoryMutate]
  );

  return {
    onCreateCategory,
    categoryCreating,
  };
};
