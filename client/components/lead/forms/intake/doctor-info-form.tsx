import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadIntakeActions } from "@/hooks/lead/use-lead";

import {
  IntakeDoctorInfoSchema,
  IntakeDoctorInfoSchemaType,
} from "@/schemas/lead";

import ReactDatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type DoctorInfoFormProps = {
  leadId: string;
  info: IntakeDoctorInfoSchemaType | null | undefined;
  onClose: () => void;
};

export const DoctorInfoForm = ({
  leadId,
  info,
  onClose,
}: DoctorInfoFormProps) => {
  const { doctorIsPending, onDoctorSubmit } = useLeadIntakeActions(
    leadId,
    onClose,
    info ? true : false
  );

  const form = useForm<IntakeDoctorInfoSchemaType>({
    resolver: zodResolver(IntakeDoctorInfoSchema),
    defaultValues: info || {
      leadId,
      address: "",
      lastVisit: new Date(),
      phone: "",
      reasonForVisit: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
          onSubmit={form.handleSubmit(onDoctorSubmit)}
        >
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dr. Joe"
                      disabled={doctorIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="123 Main St"
                      disabled={doctorIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LAST VISIT */}
            <FormField
              control={form.control}
              name="lastVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Visit</FormLabel>
                  <FormControl>
                    <ReactDatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MM-dd-yyyy"
                      placeholderText="6/9/2024"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone#</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="555-555-5555"
                      disabled={doctorIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* REASON FOR VISIT */}
            <FormField
              control={form.control}
              name="reasonForVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason For Visit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Check Up"
                      disabled={doctorIsPending}
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
            <Button disabled={doctorIsPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
