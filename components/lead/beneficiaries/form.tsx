import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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

import { states } from "@/constants/states";
import { Textarea } from "@/components/ui/textarea";

import { Gender } from "@prisma/client";

import { LeadBeneficiarySchema } from "@/schemas";
import { LeadBeneficiary } from "@prisma/client";
import {
  leadBeneficiaryInsert,
  leadBeneficiaryUpdateById,
} from "@/actions/lead";

type BeneficiaryFormProps = {
  leadId?: string;
  beneficiary?: LeadBeneficiary;
  onBeneficiaryChange: (e: LeadBeneficiary) => void;
  onClose?: () => void;
};

type BeneficiaryFormValues = z.infer<typeof LeadBeneficiarySchema>;

export const BeneficiaryForm = ({
  leadId,
  beneficiary,
  onBeneficiaryChange,
  onClose,
}: BeneficiaryFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const btnTitle = beneficiary ? "Update" : "Add";

  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(LeadBeneficiarySchema),
    defaultValues: beneficiary || {
      leadId: leadId,
      type: "Primary",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: BeneficiaryFormValues) => {
    setLoading(true);

    if (leadId) {
      leadBeneficiaryInsert(values).then((data) => {
        if (data.success) {
          const newBeneficiary = data.success;
          onBeneficiaryChange(newBeneficiary);
          router.refresh();
          toast.success(" Beneficiary Added!");
          if (onClose) {
            onClose();
          }
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      leadBeneficiaryUpdateById(values).then((data) => {
        if (data.success) {
          const newBeneficiary = data.success;
          onBeneficiaryChange(newBeneficiary);
          router.refresh();
          toast.success(" Beneficiary Updated!");
          if (onClose) {
            onClose();
          }
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    }

    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Type
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlType"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* FIRSTNAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      First Name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        disabled={loading}
                        autoComplete="off"
                        type="text"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* LASTNAME */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Last Name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        disabled={loading}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* GENDER */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Gender
                      <FormMessage />
                    </FormLabel>
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
                  </FormItem>
                )}
              />

              {/* DATE OF BIRTH */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="flex items-center justify-between">
                      Date of birth
                      <FormMessage />
                    </FormLabel>
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
            </div>
            <div className="flex flex-col">
              {/* CELLPHONE */}
              <FormField
                control={form.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Cell Phone
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="555-555-5555"
                        disabled={loading}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      Email
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="jon.doe@example.com"
                        disabled={loading}
                        autoComplete="off"
                        type="email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Address
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 main street"
                        disabled={loading}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      City
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Queens"
                        disabled={loading}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      State
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlState"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      autoComplete="off"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.abv} value={state.abv}>
                            {state.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* ZIP */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Zip Code
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="15468"
                        disabled={loading}
                        autoComplete="postal-code"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Notes
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="notes"
                        disabled={loading}
                        autoComplete="off"
                        rows={10}
                      />
                    </FormControl>
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
              {btnTitle}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
