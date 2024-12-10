import { useLeadStore } from "@/stores/lead-store";
import { useLeadConditionStore } from "@/stores/lead-condition-store";
import {
  useLeadConditionActions,
  useLeadConditionData,
} from "@/hooks/lead/use-condition";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FullLeadMedicalCondition } from "@/types";
import { LeadConditionSchema, LeadConditionSchemaType } from "@/schemas/lead";

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

import { DrawerRight } from "@/components/custom/drawer/right";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ConditionForm = () => {
  const { leadId } = useLeadStore();
  const { isConditionFormOpen, onConditionFormClose } = useLeadConditionStore();
  const { onGetLeadCondition } = useLeadConditionData(leadId as string);
  const { condition, conditionFetching } = onGetLeadCondition();
  const { onConditionUpsert, conditionUpserting } = useLeadConditionActions();

  return (
    <DrawerRight
      title="New Condition"
      isOpen={isConditionFormOpen}
      onClose={onConditionFormClose}
    >
      <SkeletonWrapper isLoading={conditionFetching}>
        <CondForm
          leadId={leadId}
          condition={condition}
          loading={conditionUpserting}
          onSubmit={onConditionUpsert}
          onClose={onConditionFormClose}
        />
      </SkeletonWrapper>
    </DrawerRight>
  );
};

type CondFormProps = {
  loading: boolean;
  leadId?: string;
  condition?: FullLeadMedicalCondition | null;
  onSubmit: (values: LeadConditionSchemaType) => void;
  onClose: () => void;
};

const CondForm = ({
  loading,
  leadId,
  condition,
  onSubmit,
  onClose,
}: CondFormProps) => {
  const btnTitle = condition ? "Update" : "Add";

  const { onGetAdminConditions } = useLeadConditionData("admin");
  const { conditions, conditionsFetching } = onGetAdminConditions();

  const form = useForm<LeadConditionSchemaType>({
    resolver: zodResolver(LeadConditionSchema),
    //@ts-ignore
    defaultValues: condition || {
      leadId,
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
                      disabled={conditionsFetching}
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
