"use client";
import { Box } from "@/components/reusable/box";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Smile, Zap } from "lucide-react";

export const Text = () => {
  return (
    <Box
      icon={Zap}
      title="Initial Preset Texts"
      description="Send new leads a text when they come into the systme. If ypou chose multiple template we'll choose a different one eacj time a new lead comes in."
      subdescription="* Delete all templates if you do not wish to use this feature"
    >
      <div className="text-destructive">
        <AlertCircle className="h-4 w-4" />
        Per CTIA regulations, you must include the name of the company you
        represent and your name in the first text message that is send to your
        leads.
      </div>
      <div className="relative">
        <Textarea placeholder="message" />
        <Smile className="absolute text-primary -right-2 -top-2" />
      </div>
      <div className="flex justify-between font-light text-xs gap-2">
        <div className="flex flex-col gap-2">
          <p>48/700 (1 test message)</p>
          <p>Opt-out notice: ...If this was a mistake, please reply cancel</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            Include opt-in notice in estimate cost? <Switch name="opting" />
          </p>
          <p>Estimated cost: $0.01</p>
        </div>
      </div>
      <p className="text-xs font-light">
        <span className="font-bold">Available keyworkds: </span>
        #first_name, #last_name, #full_name, #street_adress, #city, #state,
        #zip_code, #birthday, #my_email, #my_office_phone,number,
        #my_forwarding_number, #my_first_name, #my_last_name, #my_full_name,
        #my_company_name, #my_booking_link, #next_month_full_name, #new_line
      </p>
      <div className="flex items-center space-x-2 mt-3">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Upload image?
        </label>
      </div>
      <div className="text-right">
        <Button>SAVE TEXT</Button>
      </div>
    </Box>
  );
};
