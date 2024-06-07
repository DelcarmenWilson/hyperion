import BalanceCards from "./balance-cards";
import CatergoryCards from "./category-cards";

type ExpensesClientProp = {
  leadId: string;
  size?: string;
};

export const ExpensesClient = ({
  leadId,
  size = "full",
}: ExpensesClientProp) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <BalanceCards leadId={leadId} />

      <CatergoryCards leadId={leadId} />
    </div>
  );
};
