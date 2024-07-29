"use client";
import { useState } from "react";
import { Check, HelpCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UserPhoneNumberSchema,
  UserPhoneNumberSchemaType,
} from "@/schemas/user";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { isAValidPhoneNumber } from "@/formulas/phones";
import { phoneNumberInsert } from "@/actions/phonenumber";
import { states } from "@/constants/states";
import { CardLayout } from "@/components/custom/card/layout";
import { PhonePurchaseItems as PhonePurchaseItems } from "@/constants/phone";
import { ItemProps } from "@/types";

export const PurchasePhoneNumberForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<UserPhoneNumberSchemaType>({
    resolver: zodResolver(UserPhoneNumberSchema),
    defaultValues: {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = (values: UserPhoneNumberSchemaType) => {
    setLoading(true);
    //TODO - need to work on this functionally in the server.. THIS may need to be remover completelty
    phoneNumberInsert(values).then((data) => {
      if (data.success) {
        // userEmitter.emit("policyInfoUpdated", {
        //   ...data.success,
        //   startDate: data.success?.startDate || undefined,
        // });
        // userEmitter.emit("leadStatusChanged", data.success.leadId, "Sold");

        toast.success(data.success);
      }
      // if (data.error) {
      //   form.reset();
      //   toast.error(data.error);
      // }
    });

    setLoading(false);
  };

  // const onPurchaseNumber = () => {
  //   if (!stateSelected) {
  //     toast.error("Please select a State");
  //     return;
  //   }

  //   if (numberSelected.length < 10) {
  //     toast.error("10 digits requires ex. 7189892356");
  //     return;
  //   }
  //   if (!isAValidPhoneNumber(numberSelected)) {
  //     toast.error("Not a valid phone number");
  //     return;
  //   }

  //   phoneNumberInsert(numberSelected, stateSelected).then((data) => {
  //     if (data.error) {
  //       toast.error(data.error);
  //     }
  //     if (data.success) {
  //       toast.success(data.success);
  //       setStateSelected("");
  //       setNumberSelected("");
  //     }
  //   });
  // };
  return (
    <CardLayout title="Purchase Phone Numbers" icon={Phone}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Search by</span>
          <RadioGroup defaultValue="option-one" className="grid-cols-2 w-fit">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">State</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Area code</Label>
            </div>
          </RadioGroup>
          <p className="text-primary font-bold text-right uppercase">
            Select all States
          </p>

          {/* <Select
            name="ddlState"
            disabled={loading}
            onValueChange={(value) => setStateSelected(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select States you want phone numbers in" />
            </SelectTrigger>
            <SelectContent >
              {states.map((state) => (
                <SelectItem key={state.abv} value={state.abv}>
                  {state.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Phone number"
            onChange={(e) => setNumberSelected(e.target.value)}
          /> */}

          <Form {...form}>
            <form
              className="space-y-2 px-2 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className=" col-span-2">
                    <FormLabel>State</FormLabel>
                    <Select
                      name="ddlState"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select States you want phone numbers in" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE NUMBER */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Phone number"
                        disabled={loading}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
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
                <Button disabled={loading} type="submit">
                  Purchase
                </Button>

                {/* <Button
            disabled={!numberSelected}
            className="mt-4 self-end"
            onClick={onPurchaseNumber}
          >
            Purchase
          </Button> */}
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-primary">Yes you can</h4>
          <div className="flex flex-col gap-1 font-light text-sm">
            {PhonePurchaseItems.map((item, i) => (
              <Item key={i} text={item.text} />
            ))}
          </div>
          <span className="flex items-center gap-2 font-bold text-primary">
            <HelpCircle size={16} />
            Looking for even more information about phone numbers in Hyperion?
          </span>
        </div>
      </div>
    </CardLayout>
  );
};

export const Item = ({ text }: ItemProps) => {
  return (
    <span className="flex items-center gap-2">
      <Check size={16} />
      {text}
    </span>
  );
};
