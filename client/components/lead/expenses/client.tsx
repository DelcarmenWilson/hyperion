import { BalanceCards } from "./balance-cards";
import { CatergoryCards } from "./category-cards";

type ExpensesClientProp = {
  size?: string;
};

export const ExpensesClient = ({ size = "full" }: ExpensesClientProp) => {
  return (
    <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
      <BalanceCards />
      <CatergoryCards />
    </div>
  );
};
