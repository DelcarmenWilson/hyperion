"use client";
import { useHyperionLeadsData } from "../hooks/use-hyperion-leads";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { columns } from "./columns";
import { HyperionLeadList } from "./list";

export const HyperionLeadClient = () => {
  const { isList, setIsList, leads, isLeadsFetching } = useHyperionLeadsData();
  const topMenu = (
    <ListGridTopMenu
      text="Add Lead"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => {}}
      showButton={false}
    />
  );
  return (
    <SkeletonWrapper isLoading={isLeadsFetching}>
      {isList ? (
        <DataTable
          columns={columns}
          data={leads || []}
          headers
          topMenu={topMenu}
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-xl font-semibold">Hyperion Leads</h4>
            {topMenu}
          </div>
          <HyperionLeadList leads={leads || []} />
        </>
      )}
    </SkeletonWrapper>
  );
};
