import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import { CalculatePremium, CarrierPremium } from "@/formulas/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAge } from "@/formulas/dates";
import { useAgentCarrierData } from "@/app/(pages)/settings/(routes)/config/hooks/use-carrier";
import { PremiumCard } from "./premium-card";

export const PhoneQuoter = () => {
  const { lead, showQuoter } = usePhoneStore();
  const { carriers } = useAgentCarrierData();
  const [coverage, setCoverage] = useState("");
  const [premium, setPremium] = useState(0);
  const [carrierPremiums, setCarrierPremiums] = useState<CarrierPremium[]>([]);
  // const premuim = CalculatePremium();

  const onCalculate = () => {
    const newPremium = CalculatePremium(carriers, lead?.dateOfBirth, coverage);
    // const parsePremium = parseInt(newPremium);
    // if (isNaN(parsePremium)) toast.error(newPremium);

    // setPremium(parsePremium);
    if (typeof newPremium == "string") toast.error(newPremium);
    else setCarrierPremiums(newPremium);
  };
  if (!lead) return null;
  return (
    <>
      <div
        className={cn(
          "flex flex-col absolute items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden bg-background",
          showQuoter && "bottom-0"
        )}
      >
        <p className="text-center font-bold text-3xl">Quoter</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 border-e">
            <p>
              {lead.firstName} {lead.lastName}
            </p>

            <p>age:{getAge(lead.dateOfBirth)}</p>

            <p>Coverage Amount</p>
            <Input
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              type="number"
            />
            <Button onClick={onCalculate}>Calculate</Button>
          </div>
          <div className="flex flex-col gap-2">
            {/* <h1 className="text-4xl">{premium}</h1> */}
            {carrierPremiums?.map((carrierPremium) => (
              <PremiumCard carrierPremium={carrierPremium} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
