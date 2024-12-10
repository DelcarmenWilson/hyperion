"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadInfoActions, useLeadInfoData } from "@/hooks/lead/use-lead";

import {
  LeadGeneralSchema,
  LeadGeneralSchemaType,
  LeadGeneralSchemaTypeP,
} from "@/schemas/lead";
import { Gender, MaritalStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";
import ReactDatePicker from "react-datepicker";

export const GeneralInfoForm = () => {
  const { leadId, isGeneralFormOpen, onGeneralFormClose } = useLeadStore();
  const { onGetLeadGeneralInfo } = useLeadInfoData(leadId as string);
  const { generalInfo, generalInfoFetching } = onGetLeadGeneralInfo();
  const { onUpdateLeadGeneralInfo, generalInfoUpdating } =
    useLeadInfoActions(onGeneralFormClose);

  if (!generalInfo) return null;
  return (
    <Dialog open={isGeneralFormOpen} onOpenChange={onGeneralFormClose}>
      <DialogContent>
        <CustomDialogHeader
          icon={User}
          title="General"
          subTitle={`${generalInfo.firstName} ${generalInfo.lastName}`}
        />
        <SkeletonWrapper isLoading={generalInfoFetching}>
          <GeneralForm
            generalInfo={generalInfo}
            loading={generalInfoUpdating}
            onSubmit={onUpdateLeadGeneralInfo}
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
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ScrollArea className="flex-1 max-h-[350px]">
          <div className="grid grid-cols-2 gap-3 justify-between">
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

            {/* DATE OF BIRTH */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    {/* <Input
                      {...field}
                      placeholder="Dob"
                      disabled={loading}
                      type="date"
                      autoComplete="DateOfBirth"
                    /> */}

                    <ReactDatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="MM-dd-yy"
                      className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                      autoFocus={false}
                    />
                  </FormControl>
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

            {/* SMOKER */}
            <FormField
              control={form.control}
              name="smoker"
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-2 lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                  <div className="flex flex-col space-y-0.5">
                    <FormLabel>Smoker</FormLabel>

                    <span className="text-[0.8rem] text-muted-foreground">
                      Is the lead a smoker?
                    </span>
                  </div>

                  <FormControl>
                    <Switch
                      name="cblSmoker"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="mat-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
