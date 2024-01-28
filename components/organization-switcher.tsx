"use client";

import { useState } from "react";
import { Organization } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { ChevronsUpDown, Building, Check, PlusCircle } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useMasterAccountModal } from "@/hooks/use-master-account-modal";

type PopoverTriggersProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OrganizationSwitcherProps extends PopoverTriggersProps {
  items: Organization[];
}
export const OrganizationSwitcher = ({
  className,
  items = [],
}: OrganizationSwitcherProps) => {
  const organizationModal = useMasterAccountModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentOrganization = formattedItems.find(
    (item) => item.value === params.organizationId
  );

  const [open, setOpen] = useState(false);

  const onOrganizationSelect = (organization: {
    value: string;
    label: string;
  }) => {
    setOpen(false);
    router.push(`/${organization.value}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a organization"
          className={cn("w-[200px] justify-between", className)}
        >
          <Building className="mr-2 h-4 w-4" />
          {currentOrganization?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Organizations" />
            <CommandEmpty>No Organizations Found</CommandEmpty>
            <CommandGroup heading="Organizations">
              {formattedItems.map((organization) => (
                <CommandItem
                  key={organization.value}
                  onSelect={() => onOrganizationSelect(organization)}
                >
                  <Building className="mr-2 h-4 w-4" />
                  {organization.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentOrganization?.value === organization.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  organizationModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
