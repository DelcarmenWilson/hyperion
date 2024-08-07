import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BluePrintSchema, BluePrintSchemaType } from "@/schemas/blueprint";
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
import { bluePrintInsert } from "@/actions/blueprint";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const BluePrintForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const form = useForm<BluePrintSchemaType>({
    resolver: zodResolver(BluePrintSchema),
    defaultValues: { period: "Week" },
  });
  const bluePrintFormSubmit = async (values: BluePrintSchemaType) => {
    const newBluePrint = await bluePrintInsert(values);
    if (newBluePrint.error) {
      toast.error(newBluePrint.error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["agentBluePrints"] });
      onClose();
      toast.success("new blue print created");
    }
  };

  return (
    <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(bluePrintFormSubmit)}>
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Period
                  <FormMessage />
                </FormLabel>
                {/* <FormControl>
                   <Input {...field} placeholder="Please enter period" /> 
                  
                  
                </FormControl> */}

                <Select
                  name="ddl-Period"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  autoComplete="period"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

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

export default BluePrintForm;
