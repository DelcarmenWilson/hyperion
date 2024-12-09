import { BalanceCards } from "./balance-cards";
import { CatergoryCards } from "./category-cards";

type ExpensesClientProp = {
  leadId: string;
  size?: string;
};

export const ExpensesClient = ({
  leadId,
  size = "full",
}: ExpensesClientProp) => {
  return (
    <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
      <BalanceCards leadId={leadId} />
      <CatergoryCards leadId={leadId} />
    </div>
  );
};
