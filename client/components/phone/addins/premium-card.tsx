import { CarrierPremium } from "@/formulas/lead";

type Props = {
  carrierPremium: CarrierPremium;
};
export const PremiumCard = ({ carrierPremium }: Props) => {
  const { name, premium } = carrierPremium;
  return (
    <div>
      <p>{name}</p>
      <p>{premium}</p>
    </div>
  );
};
