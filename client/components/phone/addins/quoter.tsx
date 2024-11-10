import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import { CalculatePremium, CarrierPremium } from "@/formulas/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAge } from "@/formulas/dates";
import { useAgentCarrierData } from "@/app/(pages)/(main)/settings/(routes)/config/hooks/use-carrier";
import { PremiumCard } from "./premium-card";
import { InputGroup } from "@/components/reusable/input-group";
import { TextGroup } from "@/components/reusable/text-group";
import { EmptyCard } from "@/components/reusable/empty-card";

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
          "flex flex-col absolute items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden bg-background p-3",
          showQuoter && "bottom-0"
        )}
      >
        <p className="text-center font-bold text-3xl">Quoter</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 border-e p-2">
            <p className="text-center text-2xl font-bold">
              {lead.firstName} {lead.lastName}
            </p>

            <TextGroup label="Age" value={getAge(lead.dateOfBirth)} />
            <TextGroup label="Smoker" value={lead.smoker ? "Yes" : "No"} />

            <p>Coverage Amount</p>
            <Input
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              type="number"
            />
            <Button onClick={onCalculate}>Calculate</Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-red-500 font-bold">
              ** Please do not use this for any final quotes
            </p>
            <p className="text-red-500 font-bold">
              ** This is still under development
            </p>
            {carrierPremiums?.map((carrierPremium) => (
              <PremiumCard
                key={carrierPremium.name}
                carrierPremium={carrierPremium}
              />
            ))}
            {carrierPremiums.length == 0 && <EmptyCard title="Start Quoting" />}
          </div>
        </div>
      </div>
    </>
  );
};
