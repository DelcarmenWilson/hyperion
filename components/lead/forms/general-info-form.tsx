import * as z from "zod";
import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadGeneralSchema, LeadSchema } from "@/schemas";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type GeneralInfoFormProps = {
  lead: LeadGeneralInfo;
  onChange: (e?: LeadGeneralInfo) => void;
};

type GeneralInfoFormValues = z.infer<typeof LeadGeneralSchema>;

export const GeneralInfoForm = ({ lead, onChange }: GeneralInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(LeadGeneralSchema),
    defaultValues: lead,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onChange) {
      onChange();
    }
  };

  const onSubmit = async (values: GeneralInfoFormValues) => {
    setLoading(true);
    // await leadUpdateByIdGeneralInfo(values).then((data) => {
    //   if (data.success) {
    //     if (onChange) {
    //       onChange(data.success);
    //     }
    //     toast.success("Lead info Updated");
    //   }
    //   if (data.error) {
    //     form.reset();
    //     toast.error(data.error);
    //   }
    // });

    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-1 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-1">
              {/* DATE OF BIRTH */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Date of birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Weight</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]"> Height</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="5'2"
                        disabled={loading}
                        autoComplete="Height"
                        type="text"
                      />
                    </FormControl>
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
                    {/* <Select
                      name="ddlSmoker"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 h-6 p-1">
                          <SelectValue placeholder="Select a Choice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select> */}

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Income</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Gender</FormLabel>
                    <Select
                      name="ddlGender"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 h-6 p-1">
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Marital Status</FormLabel>
                    <Select
                      name="ddlMaritalStatus"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 h-6 p-1">
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
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
