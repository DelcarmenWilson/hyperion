import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/use-current-user";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { LeadExportSchema, LeadExportSchemaType } from "@/schemas/lead";
import { formatDate, monthStartEnd } from "@/formulas/dates";

import { states } from "@/constants/states";
import { importVendors } from "@/constants/lead";
import { exportLeads } from "@/lib/xlsx";

export const ExportLeadForm = ({ onClose }: { onClose?: () => void }) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const month = monthStartEnd();

  const form = useForm<LeadExportSchemaType>({
    resolver: zodResolver(LeadExportSchema),
    defaultValues: {
      userId: user?.id as string,
      type: "Excel",
      from: month.from,
      to: new Date(),
      state: "All",
      vendor: "All",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) onClose();
  };

  const onSubmit = async (values: LeadExportSchemaType) => {
    setLoading(true);
    axios.post("/api/leads/export", values).then((reponse) => {
      const data = reponse.data;

      if (!data.length) {
        toast.error("No data return");
      } else {
        exportLeads(values.type, data);

        toast.success("Leads exported succesfully!");
      }
    });

    setLoading(false);
    if (onClose) onClose();
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
              {/* TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> File Type</FormLabel>
                    <Select
                      name="ddlFileType"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="Pdf">Pdf</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FROM */}
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Start Date</FormLabel>
                    <Popover>
                      <FormControl>
                        <div className="relative">
                          <Input
                            value={
                              field.value
                                ? formatDate(field.value)
                                : "Pick a date"
                            }
                          />
                          <PopoverTrigger asChild>
                            <CalendarIcon
                              size={16}
                              className="absolute opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer"
                            />
                          </PopoverTrigger>
                        </div>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TO */}
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> End Date</FormLabel>
                    <Popover>
                      <FormControl>
                        <div className="relative">
                          <Input
                            value={
                              field.value
                                ? formatDate(field.value)
                                : "Pick a date"
                            }
                          />
                          <PopoverTrigger asChild>
                            <CalendarIcon
                              size={16}
                              className="absolute opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer"
                            />
                          </PopoverTrigger>
                        </div>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> State</FormLabel>
                    <Select
                      name="ddlState"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="All">ALL</SelectItem>
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
              {/* VENDOR */}
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <Select
                      name="ddlVendor"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="All">ALL</SelectItem>
                        {importVendors.map((vendor) => (
                          <SelectItem key={vendor.name} value={vendor.value}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
              Export
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
