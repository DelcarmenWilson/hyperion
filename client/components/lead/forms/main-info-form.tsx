"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadStore, useLeadMainInfoActions } from "@/hooks/lead/use-lead";

import {
  LeadMainSchema,
  LeadMainSchemaType,
  LeadMainSchemaTypeP,
} from "@/schemas/lead";

import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
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

import { states } from "@/constants/states";

export const MainInfoForm = () => {
  const { isMainFormOpen, onMainFormClose } = useLeadStore();
  const { mainInfo, isFetchingMainInfo, loading, onMainInfoUpdate } =
    useLeadMainInfoActions(onMainFormClose);

  if (!mainInfo) return null;
  return (
    <CustomDialog
      title="Demographics"
      subTitle={`${mainInfo.firstName} ${mainInfo.lastName}`}
      description="Main Info Form"
      open={isMainFormOpen}
      onClose={onMainFormClose}
    >
      <SkeletonWrapper isLoading={isFetchingMainInfo}>
        <MainForm
          mainInfo={mainInfo}
          loading={loading}
          onSubmit={onMainInfoUpdate}
          onClose={onMainFormClose}
        />
      </SkeletonWrapper>
    </CustomDialog>
  );
};

type MainFormProps = {
  mainInfo: LeadMainSchemaTypeP;
  loading: boolean;
  onSubmit: (values: LeadMainSchemaType) => void;
  onClose: () => void;
};
const MainForm = ({ mainInfo, loading, onSubmit, onClose }: MainFormProps) => {
  const form = useForm<LeadMainSchemaType>({
    resolver: zodResolver(LeadMainSchema),
    //@ts-ignore
    defaultValues: mainInfo,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  if (!mainInfo) return null;
  return (
    <Form {...form}>
      <form
        className="flex flex-col overflow-hidden h-fullspace-y-2 px-2 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* FIRST NAME */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="first name"
                      disabled={loading}
                      autoComplete="firstName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LAST NAME */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="last name"
                      disabled={loading}
                      autoComplete="lastName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CELLPHONE */}
          <FormField
            control={form.control}
            name="cellPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone #</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="347-859-8547"
                    disabled={loading}
                    autoComplete="phone"
                    // pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="jon.doe@example.com"
                    disabled={loading}
                    autoComplete="email"
                    type="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ADDRESS */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123 main street"
                    disabled={loading}
                    autoComplete="address"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* CITY */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel> City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Queens"
                    disabled={loading}
                    autoComplete="address-level2"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* STATE */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    name="ddlState"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="address-level2"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {states.map((state) => (
                        <SelectItem key={state.abv} value={state.abv}>
                          {state.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ZIPCODE */}
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="15468"
                      disabled={loading}
                      autoComplete="postal-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
  );
};
