import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import {
  CarrierConditionSchema,
  CarrierConditionSchemaType,
} from "@/schemas/admin";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import {
  adminCarrierConditionInsert,
  adminCarrierConditionUpdateById,
} from "@/actions/admin/carrier-condition";
import { FullCarrierCondition } from "@/types";
import { GetCarriersAndConditionsResponseType } from "@/app/api/admin/carrier-conditions/route";

type CarrierConditionFormProps = {
  carrierCondition?: FullCarrierCondition;
  onClose: () => void;
};
export const CarrierConditionForm = ({
  carrierCondition,
  onClose,
}: CarrierConditionFormProps) => {
  const [loading, setLoading] = useState(false);

  const ccQuery = useQuery<GetCarriersAndConditionsResponseType>({
    queryKey: ["adminCarriersConditions"],
    queryFn: () =>
      fetch("/api/admin/carrier-conditions").then((res) => res.json()),
  });

  const form = useForm<CarrierConditionSchemaType>({
    resolver: zodResolver(CarrierConditionSchema),
    //@ts-ignore
    defaultValues: carrierCondition || {
      carrierId: ccQuery.data?.carriers ? ccQuery.data?.carriers[0].id : "",
      conditionId: ccQuery.data?.conditions
        ? ccQuery.data?.conditions[0].id
        : "",
      requirements: "",
      notes: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: CarrierConditionSchemaType) => {
    setLoading(true);
    if (carrierCondition) {
      const updatedCarrier = await adminCarrierConditionUpdateById(values);

      if (updatedCarrier.success) {
        userEmitter.emit("carrierConditionUpdated", updatedCarrier.success);
        toast.success("Carrier condition updated!");
        onClose();
      } else toast.error(updatedCarrier.error);
    } else {
      const insertedCarrier = await adminCarrierConditionInsert(values);

      if (insertedCarrier.success) {
        userEmitter.emit("carrierConditionInserted", insertedCarrier.success);
        form.reset();
        if (onClose) onClose();
        toast.success("Carrier created!");
      } else toast.error(insertedCarrier.error);
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
          <div className="flex flex-col gap-2">
            {/* CARRIER */}
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Carrier
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlCarriers"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="carriers"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Carrier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ccQuery.data?.carriers?.map((carrier) => (
                        <SelectItem key={carrier.id} value={carrier.id}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* CONDTION */}
            <FormField
              control={form.control}
              name="conditionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Medical Condition
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlCondtions"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="carriers"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ccQuery.data?.conditions?.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* REQUIEREMENTS*/}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Requirements
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Requirements"
                      disabled={loading}
                      autoComplete="Description"
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* NOTES*/}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Notes
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notes"
                      disabled={loading}
                      autoComplete="Notes"
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
