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
    <div className="flex flex-1 flex-col h-full w-full gap-2 overflow-hidden ps-2">
      <BalanceCards leadId={leadId} size={size} />
      <CatergoryCards leadId={leadId} size={size} />
    </div>
  );
};
