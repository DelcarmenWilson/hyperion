import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadGeneralSchema, LeadGeneralSchemaType } from "@/schemas/lead";
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
import { Gender, MaritalStatus } from "@prisma/client";

import { LeadGeneralInfo } from "@/types";
import { leadUpdateByIdGeneralInfo } from "@/actions/lead";

import { Switch } from "@/components/ui/switch";

type GeneralInfoFormProps = {
  info: LeadGeneralInfo;
  onClose: () => void;
};

export const GeneralInfoForm = ({ info, onClose }: GeneralInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<LeadGeneralSchemaType>({
    resolver: zodResolver(LeadGeneralSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: LeadGeneralSchemaType) => {
    setLoading(true);
    await leadUpdateByIdGeneralInfo(values).then((data) => {
      if (data.success) {
        userEmitter.emit("generalInfoUpdated", {
          ...data.success,
          dateOfBirth: data.success.dateOfBirth?.toString(),
          weight: data.success.weight?.toString(),
          height: data.success.height?.toString(),
          income: data.success.income?.toString(),
        });
        onClose();
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
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
