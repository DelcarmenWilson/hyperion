import * as z from "zod";
import { useEffect, useState } from "react";
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

import { Textarea } from "@/components/ui/textarea";

import { MedicalCondition } from "@prisma/client";

import { LeadConditionSchema } from "@/schemas";
import { LeadMedicalCondition } from "@prisma/client";
import { leadConditionInsert, leadConditionUpdateById } from "@/actions/lead";
import { adminMedicalConditionsGetAll } from "@/data/admin";

type ConditionFormProps = {
  leadId?: string;
  condition?: LeadMedicalCondition;
  onConditionChange: (e: LeadMedicalCondition) => void;
  onClose?: () => void;
};

type ConditionFormValues = z.infer<typeof LeadConditionSchema>;

export const ConditionForm = ({
  leadId,
  condition,
  onConditionChange,
  onClose,
}: ConditionFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const btnTitle = condition ? "Update" : "Add";
  const [conditions, setConditions] = useState<MedicalCondition[]>();

  const form = useForm<ConditionFormValues>({
    resolver: zodResolver(LeadConditionSchema),
    defaultValues: condition || {
      leadId: leadId,
      conditionId: "",
      diagnosed: "",
      medications: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: ConditionFormValues) => {
    setLoading(true);

    if (leadId) {
      leadConditionInsert(values).then((data) => {
        if (data.success) {
          const newCondition = data.success;
          onConditionChange(newCondition);
          router.refresh();
          toast.success(" Condition Added!");
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
      leadConditionUpdateById(values).then((data) => {
        if (data.success) {
          const newCondition = data.success;
          onConditionChange(newCondition);
          router.refresh();
          toast.success(" Condition Updated!");
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

  useEffect(() => {
    adminMedicalConditionsGetAll().then((data) => {
      console.log(data);
      setConditions(data);
    });
  }, []);
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* CONDITION */}
              <FormField
                control={form.control}
                name="conditionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Condition
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlCondition"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Condition" />
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

              {/* DATE OF BIRTH */}
              <FormField
                control={form.control}
                name="diagnosed"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="flex items-center justify-between">
                      Date Diagnosed
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Diagnosed"
                        disabled={loading}
                        type="date"
                        autoComplete="Diagnosed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Medications */}
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Medications
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="medications"
                        disabled={loading}
                        autoComplete="off"
                        rows={5}
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
                        rows={5}
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
