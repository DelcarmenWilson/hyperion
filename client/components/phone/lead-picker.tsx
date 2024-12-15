"use client";
import { useLeadData } from "@/hooks/lead/use-lead";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatPhoneNumber } from "@/formulas/phones";

interface Props {
  filter: string;
  onChange: (name: string, number: string) => void;
  open: boolean;
  onClose: () => void;
}

const LeadPicker = ({ filter, onChange, open, onClose }: Props) => {
  const { onGetLeadsFiltered } = useLeadData();
  const { leads, leadsFetching, leadsLoading } = onGetLeadsFiltered(filter);
  if (!open) return null;
  return (
    <Command
      className="border"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <CommandEmpty>
        <p>No leads found</p>
        <p className="text-xs text-muted-foreground">{filter} does not exist</p>
      </CommandEmpty>
      <CommandGroup>
        <CommandList>
          <SkeletonWrapper isLoading={leadsFetching}>
            {leads?.map((lead) => (
              <CommandItem
                key={lead.id}
                onSelect={() => {
                  onChange(
                    `${lead.firstName} ${lead.lastName}`,
                    lead.cellPhone.replace("+1", "")
                  );
                  onClose();
                }}
              >
                <LeadRow
                  firstName={lead.firstName}
                  lastName={lead.lastName}
                  cellPhone={lead.cellPhone}
                />
                {/* <Check
                  className={cn(
                    "mr-2 w-4 h-4 opacity-0",
                    value === lead.id && "opacity-100"
                  )}
                /> */}
              </CommandItem>
            ))}
          </SkeletonWrapper>
        </CommandList>
      </CommandGroup>
    </Command>
  );
};

const LeadRow = ({
  firstName,
  lastName,
  cellPhone,
}: {
  firstName: string;
  lastName: string;
  cellPhone: string;
}) => {
  return (
    <div className="flex items-center justify-between  w-full">
      <span className="font-bold">
        {firstName} {lastName}
      </span>
      <span> {formatPhoneNumber(cellPhone)}</span>
    </div>
  );
};

export default LeadPicker;
