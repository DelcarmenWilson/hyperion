import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FullTimeInfoSchema,
  FullTimeInfoSchemaType,
} from "@/schemas/blueprint";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fullTimeInfoInsert, fullTimeInfoUpdateByUserId } from "@/actions/blueprint";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { FullTimeInfo } from "@prisma/client";
import { TargetList } from "./list";
import { calculateDailyBluePrint } from "@/constants/blue-print";
type Props = {
  fullTimeInfo?: FullTimeInfo;
  onClose: () => void;
};
export const FullTimeInfoForm = ({ onClose, fullTimeInfo }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<FullTimeInfoSchemaType>({
    resolver: zodResolver(FullTimeInfoSchema),
    defaultValues: fullTimeInfo || { workType: "PartTime" },
  });
  const fullTimeInfoFormSubmit = async (values: FullTimeInfoSchemaType) => {
    // const newFullTimeInfo = await fullTimeInfoUpdateByUserId(values);
    // if (newFullTimeInfo.error) {
    //   toast.error(newFullTimeInfo.error);
    // } else {
    //   queryClient.invalidateQueries({ queryKey: ["agentFullTimeInfo"] });
    //   onClose();
    //   toast.success("Agent details got updated");
    // }
    const newFullTimeInfo = await fullTimeInfoInsert(values);
    if (newFullTimeInfo.error) {
      toast.error(newFullTimeInfo.error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["agentFullTimeInfo"] });
      onClose();
      toast.success("Agent details got updated");
    }
  };

  return (
    <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(fullTimeInfoFormSubmit)}>
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Work Type
                  <FormMessage />
                </FormLabel>
                {/* <FormControl>
                   <Input {...field} placeholder="Please enter period" /> 
                  
                  
                </FormControl> */}

                <Select
                  name="ddl-workType"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  autoComplete="workType"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Parttime" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PartTime">Part Time</SelectItem>
                    <SelectItem value="FullTime">Full Time</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Working Days
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter working days" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Working Hours
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter workingHours" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Annual Target
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter annual target" />
                </FormControl>
              </FormItem>
            )}
          />

<TargetList targets={calculateDailyBluePrint(form.getValues("annualTarget"))}/>

          <div className="flex mt-2 gap-2 justify-end">
            <Button variant="outlineprimary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
