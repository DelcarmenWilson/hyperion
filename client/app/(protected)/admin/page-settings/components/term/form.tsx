import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TermCarrierSchema, TermCarrierSchemaType } from "@/schemas/admin";

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

import { Carrier, MedicalCondition } from "@prisma/client";
import axios from "axios";
import { adminTermCarrierInsert } from "@/actions/admin";
import { FullTermCarrier } from "@/types";

export const TermCarrierForm = ({
  onClose,
}: {
  onClose?: (e?: FullTermCarrier) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [carriers, setCarriers] = useState<Carrier[] | null>();
  const [conditions, setConditions] = useState<MedicalCondition[] | null>();

  const form = useForm<TermCarrierSchemaType>({
    resolver: zodResolver(TermCarrierSchema),
    defaultValues: {
      carrierId: carriers ? carriers[0].id : "",
      conditionId: conditions ? conditions[0].id : "",
      requirements: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    axios.post("/api/admin/carrier-conditions").then((response) => {
      const data = response.data;
      setCarriers(data.carriers);
      setConditions(data.conditions);
    });
  }, []);

  const onSubmit = async (values: TermCarrierSchemaType) => {
    setLoading(true);
    adminTermCarrierInsert(values).then((data) => {
      if (data.success) {
        form.reset();
        if (onClose) onClose(data.success);
        toast.success("Carrier created!");
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
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
                      {carriers?.map((carrier) => (
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
                      {conditions?.map((condition) => (
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
                      placeholder="Description"
                      disabled={loading}
                      autoComplete="Description"
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
