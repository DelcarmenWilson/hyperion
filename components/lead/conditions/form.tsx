import * as z from "zod";
import { useEffect, useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

import { FullLeadMedicalCondition } from "@/types";
import { MedicalCondition } from "@prisma/client";

import { LeadConditionSchema } from "@/schemas";

import { leadConditionInsert, leadConditionUpdateById } from "@/actions/lead";

type ConditionFormProps = {
  leadId?: string;
  condition?: FullLeadMedicalCondition;
  onClose: () => void;
};

type ConditionFormValues = z.infer<typeof LeadConditionSchema>;

export const ConditionForm = ({
  leadId,
  condition,
  onClose,
}: ConditionFormProps) => {
  const [conditions, setConditions] = useState<MedicalCondition[]>();
  const [loading, setLoading] = useState(false);
  const btnTitle = condition ? "Update" : "Add";

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
    onClose();
  };

  const onSubmit = async (values: ConditionFormValues) => {
    setLoading(true);

    if (leadId) {
      leadConditionInsert(values).then((data) => {
        if (data.success) {
          userEmitter.emit("conditionInserted", data.success);
          toast.success(" Condition Added!");
          onClose();
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      leadConditionUpdateById(values).then((data) => {
        if (data.success) {
          userEmitter.emit("conditionUpdated", data.success);
          toast.success(" Condition Updated!");
          onClose();
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    axios.post("/api/admin/conditions").then((response) => {
      setConditions(response.data);
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
