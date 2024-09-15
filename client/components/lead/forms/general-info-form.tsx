"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadStore, useLeadGeneralInfoActions } from "@/hooks/lead/use-lead";

import {
  LeadGeneralSchema,
  LeadGeneralSchemaType,
  LeadGeneralSchemaTypeP,
} from "@/schemas/lead";
import { Gender, MaritalStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";

export const GeneralInfoForm = () => {
  const { isGeneralFormOpen, onGeneralFormClose } = useLeadStore();
  const { generalInfo, isFetchingGeneralInfo, loading, onGeneralInfoUpdate } =
    useLeadGeneralInfoActions(onGeneralFormClose);
  if (!generalInfo) return null;
  return (
    <Dialog open={isGeneralFormOpen} onOpenChange={onGeneralFormClose}>
      <DialogDescription className="hidden">
        General Info Form
      </DialogDescription>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">
          Demographics -
          <span className="text-primary">
            {`${generalInfo.firstName} ${generalInfo.lastName}`}
          </span>
        </h3>
        <SkeletonWrapper isLoading={isFetchingGeneralInfo}>
          <GeneralForm
            generalInfo={generalInfo}
            loading={loading}
            onSubmit={onGeneralInfoUpdate}
            onClose={onGeneralFormClose}
          />
        </SkeletonWrapper>
      </DialogContent>
    </Dialog>
  );
};

type GeneralInfoFormProps = {
  generalInfo: LeadGeneralSchemaTypeP;
  loading: boolean;
  onSubmit: (values: LeadGeneralSchemaType) => void;
  onClose: () => void;
};
export const GeneralForm = ({
  generalInfo,
  loading,
  onSubmit,
  onClose,
}: GeneralInfoFormProps) => {
  const form = useForm<LeadGeneralSchemaType>({
    resolver: zodResolver(LeadGeneralSchema),
    //@ts-ignore
    defaultValues: generalInfo,
  });
  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div className="h-full overflow-y-auto">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-2 justify-between">
            {/* DATE OF BIRTH */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dob"
                      disabled={loading}
                      type="date"
                      autoComplete="DateOfBirth"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* WEIGHT */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="120"
                      disabled={loading}
                      autoComplete="Weight"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* HEIGHT */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Height</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="5'2"
                      disabled={loading}
                      autoComplete="Height"
                      type="text"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* INCOME */}
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12000"
                      disabled={loading}
                      autoComplete="Income"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GENDER */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="ddlGender"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.Male}>Male</SelectItem>
                      <SelectItem value={Gender.Female}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MARITAL STATUS */}
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select
                    name="ddlMaritalStatus"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={MaritalStatus.Single}>
                        Single
                      </SelectItem>
                      <SelectItem value={MaritalStatus.Married}>
                        Married
                      </SelectItem>
                      <SelectItem value={MaritalStatus.Divorced}>
                        Divorced
                      </SelectItem>
                      <SelectItem value={MaritalStatus.Widowed}>
                        Widowed
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
