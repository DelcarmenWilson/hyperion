import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadIntakeActions } from "@/hooks/lead/use-lead";
import {
  IntakeMedicalInfoSchema,
  IntakeMedicalInfoSchemaType,
} from "@/schemas/lead";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import ReactDatePicker from "react-datepicker";

type MedicalInfoFormProps = {
  leadId: string;
  info: IntakeMedicalInfoSchemaType;
  onClose: () => void;
};

export const MedicalInfoForm = ({
  info,
  leadId,
  onClose,
}: MedicalInfoFormProps) => {
  const { medicalIsPending, onMedicalSubmit } = useLeadIntakeActions(
    leadId,
    onClose,
    info ? true : false
  );

  const form = useForm<IntakeMedicalInfoSchemaType>({
    resolver: zodResolver(IntakeMedicalInfoSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-2 w-full h-full overflow-y-auto"
          onSubmit={form.handleSubmit(onMedicalSubmit)}
        >
          {/* HEALTH ISSUES */}
          <FormField
            control={form.control}
            name="healthIssues"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Do you have any health issues or concerns you’re going
                  through? Any medications, hospitalizations, surgeries,
                  doctors’ visits?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* PESCRIPTIONS */}
          <FormField
            control={form.control}
            name="prescription"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Have you been prescribed any medication in the past year that
                  you are not taking?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* HEART ATTACKS*/}
          <FormField
            control={form.control}
            name="heartAttacks"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any heart attacks, heart failures, strokes, TIA, or stints in
                  the last five years?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* BLOOD THINNERS */}
          <FormField
            control={form.control}
            name="bloodThinners"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Are you on blood thinners? (Plavix or Warfarin) or heart
                  medication (Nitrostat, Nitroglycerin, Eliquis)?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* CANCER */}
          <FormField
            control={form.control}
            name="cancer"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any cancer in the last five years? What kind? How long have
                  you been in remission?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* DAIBETES*/}
          <FormField
            control={form.control}
            name="diabetes"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">Any diabetes?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* GABAPENTIN */}
          <FormField
            control={form.control}
            name="gabapentin"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Are you taking gabapentin?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* COMPLICATIONS */}
          <FormField
            control={form.control}
            name="complications"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Have you ever experienced any complications related to
                  diabetes? (Diabetic Coma, Diabetic Neuropathy, Diabetic
                  Retinopathy, Diabetic Nephropathy, Insulin Shock, Amputation)
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* DATEDISGNOSED */}
          dateDisgnosed
          <FormField
            control={form.control}
            name="dateDisgnosed"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Would you happen to know the date that you were diagnosed with
                  diabetes?
                </FormLabel>
                <FormControl>
                  <ReactDatePicker
                    onChange={field.onChange}
                    dateFormat="MM-d-yyyy"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select a Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* A1CREADING */}
          <FormField
            control={form.control}
            name="a1cReading"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Would you happen to know your last A1C Reading? Is it less
                  than 7
                </FormLabel>
                <FormControl>
                  <ReactDatePicker
                    onChange={field.onChange}
                    dateFormat="MM-d-yyyy"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select a Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* AIDS */}
          <FormField
            control={form.control}
            name="aids"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Have you been diagnosed with AIDS, HIV, or ARC?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* HIGHBLOODPRESSURE */}
          <FormField
            control={form.control}
            name="highBloodPressure"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any high blood pressure? Are you taking lisinopril,
                  metoprolol, or amlodipine?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ASTHMA */}
          <FormField
            control={form.control}
            name="asthma"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any lupus/RA/Asthma? Are you on any inhalers?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* COPD */}
          <FormField
            control={form.control}
            name="copd"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any breathing complications or COPD? Are you on oxygen?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ANXIETY */}
          <FormField
            control={form.control}
            name="anxiety"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any anxiety or depression? Are you taking Prozac or Seroquel?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* BIPOLAR */}
          <FormField
            control={form.control}
            name="bipolar"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Are you bipolar or schizophrenic? Are you taking Sertraline,
                  Abilify, or dialysis?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* HOSPITALIZATIONS */}
          <FormField
            control={form.control}
            name="hospitalizations"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-2">
                <FormLabel className="w-[75%]">
                  Any hospitalizations in the last year for 48 hours or more?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={medicalIsPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
