"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Phone } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePhoneSetupActions } from "@/hooks/use-phone-setup";

import { PhoneNumber } from "@prisma/client";
import {
  PhoneNumberSchema,
  PhoneNumberSchemaType,
} from "@/schemas/phone-number";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { TwilioAppSelect } from "@/components/twilio/app-select";
import { UserSelect } from "@/components/user/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate } from "@/formulas/dates";

const UpdatePhoneNumberDialog = ({
  phoneNumber,
}: {
  phoneNumber: PhoneNumber;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<PhoneNumberSchemaType>({
    resolver: zodResolver(PhoneNumberSchema),
    //@ts-ignore
    defaultValues: phoneNumber,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    setOpen(false);
  };
  const { onUpdatePhoneNumber, phoneNumberUpdating } =
    usePhoneSetupActions(onCancel);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">Details</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Phone}
          title="Phone Number Details"
          subTitle={phoneNumber.sid}
        />
        <div className="p-1">
          <Form {...form}>
            <form
              className="space-y-4 px-2 w-full"
              onSubmit={form.handleSubmit(onUpdatePhoneNumber)}
            >
              <h3 className="font-semibold text-primary text-2xl italic text-center">
                {formatPhoneNumber(phoneNumber.phone)}
              </h3>

              <div className="grid grid-cols-3 text-sm">
                <TextGroup label="State" value={phoneNumber.state} />
                <TextGroup
                  label="Created At"
                  value={formatDate(phoneNumber.createdAt)}
                />
                <TextGroup
                  label="Renew At"
                  value={formatDate(phoneNumber.renewAt)}
                />
              </div>

              {/* APP */}
              <FormField
                control={form.control}
                name="app"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      App
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <TwilioAppSelect
                        disabled={phoneNumberUpdating}
                        app={field.value}
                        setApp={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* REGISTERED */}
              <FormField
                control={form.control}
                name="registered"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>Registered</FormLabel>

                      <span className="text-[0.8rem] text-muted-foreground">
                        Is the phone number registered?
                      </span>
                    </div>

                    <FormControl>
                      <Switch
                        name="cbRegistered"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* AGENTID */}
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Assigned To
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <UserSelect
                        disabled={phoneNumberUpdating}
                        userId={field.value}
                        setUserId={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                <Button
                  onClick={onCancel}
                  type="button"
                  variant="outlineprimary"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!form.formState.isDirty || phoneNumberUpdating}
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type TextGroupProps = {
  label: string;
  value: string;
};

const TextGroup = ({ label, value }: TextGroupProps) => {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <span>{value}</span>
    </div>
  );
};

export default UpdatePhoneNumberDialog;
