import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  IntakeOtherInfoSchema,
  IntakeOtherInfoSchemaType,
} from "@/schemas/lead";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { leadUpdateByIdIntakeOtherInfo } from "@/actions/lead/intake";

type OtherInfoFormProps = {
  info: IntakeOtherInfoSchemaType;
  onClose: () => void;
};

export const OtherInfoForm = ({ info, onClose }: OtherInfoFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeOtherInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "update-other-info",
      });

      queryClient.invalidateQueries({
        queryKey: ["leadInfo", `lead-${info.id}`, "leadIntakeOtherInfo"],
      });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<IntakeOtherInfoSchemaType>({
    resolver: zodResolver(IntakeOtherInfoSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = useCallback(
    (values: IntakeOtherInfoSchemaType) => {
      const toastString = "Updating Other Information...";
      toast.loading(toastString, { id: "update-other-info" });

      mutate(values);
    },
    [mutate]
  );
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* WEIGHT THIS YEAR */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (this year)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="180"
                      disabled={isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WEIGHT LAST YEAR */}
            <FormField
              control={form.control}
              name="weightLastYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Last Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="175"
                      disabled={isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HEIGHT */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="5'3"
                      disabled={isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SMOKER */}
            <FormField
              control={form.control}
              name="smoker"
              render={({ field }) => (
                <FormItem className="flex gap-x-1 items-end">
                  <FormLabel className="w-[100px]">Smoker</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* YEARS SMOKING # */}
            <FormField
              control={form.control}
              name="yearsSmoking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years Smoking</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="5"
                      disabled={isPending}
                      autoComplete="off"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SIGNATURE */}
            <FormField
              control={form.control}
              name="foreignVisited"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Countries Visited</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      disabled={isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
