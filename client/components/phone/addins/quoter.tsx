import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import { CalculatePremium, DEFAULT_BASEPREMIUM } from "@/formulas/lead";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAge } from "@/formulas/dates";
import { useAgentCarrierData } from "@/app/(pages)/(main)/settings/(routes)/config/hooks/use-carrier";

import { TextGroup } from "@/components/reusable/text-group";
import { EmptyCard } from "@/components/reusable/empty-card";
import { CarrierPremium } from "@/types/carrier";
import { USDollar } from "@/formulas/numbers";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PhoneQuoter = () => {
  const { lead, showQuoter } = usePhoneStore();
  const { carriers } = useAgentCarrierData();
  const [coverage, setCoverage] = useState("");
  const [basePremium, setBasePremium] = useState("100");
  const [baseValue, setBaseValue] = useState("1.77");
  const [carrierPremiums, setCarrierPremiums] = useState<CarrierPremium[]>([]);
  // const premuim = CalculatePremium();

  const onCalculate = () => {
    const newPremium = CalculatePremium(
      carriers,
      lead?.dateOfBirth,
      basePremium,
      baseValue,
      coverage
    );
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
          "absolute -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden bg-background p-3 border rounded",
          showQuoter && "bottom-0"
        )}
      >
        <p className="font-bold text-2xl">Quoter</p>
        <div className="flex flex-col container border rounded py-2 h-full">
          <p className="font-bold text-3xl text-center text-primary">
            {lead.firstName} {lead.lastName}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="space-y-2 border-e p-2">
              <TextGroup label="Age" value={getAge(lead.dateOfBirth)} />
              <TextGroup label="Smoker" value={lead.smoker ? "Yes" : "No"} />
            </div>

            <div className="grid grid-cols-2 gap-2 p-2">
              <p>Coverage Amount</p>{" "}
              <Input
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                type="number"
              />
              <p>Base Premiumn</p>
              <Input
                type="number"
                value={basePremium}
                onChange={(e) => setBasePremium(e.target.value)}
              />
              <p>Base Value</p>
              <Input
                type="number"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
              />
              <div />
              <div className="w-full text-end">
                <Button onClick={onCalculate}>Calculate</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-red-500 font-bold">
              ** Please do not use this for any final quotes
            </p>
            <p className="text-red-500 font-bold">
              ** This is still under development
            </p>
            <ScrollArea className="max-h-[350px]">
              <div className="grid grid-cols-2 gap-2 items-center">
                {carrierPremiums?.map((carrierPremium) => (
                  <PremiumCard
                    key={carrierPremium.name}
                    carrierPremium={carrierPremium}
                  />
                ))}
                {carrierPremiums.length == 0 && (
                  <EmptyCard title="Start Quoting" />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

const PremiumCard = ({
  carrierPremium,
}: {
  carrierPremium: CarrierPremium;
}) => {
  const { name, image, premium } = carrierPremium;
  const { onQuoterClose } = usePhoneStore();
  return (
    <Card>
      <CardContent
        className="flex items-center gap-2 hover:bg-primary/20 cursor-pointer"
        onClick={onQuoterClose}
      >
        <Avatar className="rounded-full">
          <AvatarImage className="rounded-full" src={image} />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-2xl">{name}</p>
          <p className="text-muted-foreground">
            {/* {USDollar.format(parseFloat(premium) / 12)} */}
            {(parseFloat(premium) / 12).toFixed(2)}
          </p>
        </div>
        {/* <Button className="ml-auto" onClick={onQuoterClose}>
          Select
        </Button> */}
      </CardContent>
    </Card>
  );
};
