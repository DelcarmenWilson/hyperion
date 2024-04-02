import { Input } from "@/components/ui/input";

type SimpleFilterProps<TData> = {
  filtering: string;
  setFiltering: (e: string) => void;
  placeHolder: string;
};

export function SimpleFilter<TData>({
  filtering,
  setFiltering,
  placeHolder,
}: SimpleFilterProps<TData>) {
  return (
    <>
      <Input
        id="search"
        className="max-w-sm"
        placeholder={placeHolder}
        value={filtering}
        onChange={(event) => setFiltering(event.target.value)}
      />
    </>
  );
}
