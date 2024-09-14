import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadIntakeActions } from "@/hooks/lead/use-lead";

import { IntakeBankInfoSchema, IntakeBankInfoSchemaType } from "@/schemas/lead";
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
import ReactDatePicker from "react-datepicker";

type BankInfoFormProps = {
  leadId: string;
  info: IntakeBankInfoSchemaType | null | undefined;
  onClose: () => void;
};

export const BankInfoForm = ({ leadId, info, onClose }: BankInfoFormProps) => {
  const { bankIsPending, onBankSubmit } = useLeadIntakeActions(
    leadId,
    onClose,
    info ? true : false
  );

  const form = useForm<IntakeBankInfoSchemaType>({
    resolver: zodResolver(IntakeBankInfoSchema),
    defaultValues: info || {
      leadId,
      draftDate: new Date(),
      signedDate: new Date(),
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
          onSubmit={form.handleSubmit(onBankSubmit)}
        >
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Chase"
                      disabled={bankIsPending}
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
              name="routing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing #</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="00220025"
                      disabled={bankIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACCOUNT # */}
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0000054542"
                      disabled={bankIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DRAFT DATE */}
            <FormField
              control={form.control}
              name="draftDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draft Date</FormLabel>
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
            {/* SIGNATURE */}
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      disabled={bankIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* SIGNED DATE */}
            <FormField
              control={form.control}
              name="signedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signed Date</FormLabel>
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
          </div>
          <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={bankIsPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
