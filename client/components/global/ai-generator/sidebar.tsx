import React from "react";
import { Button } from "@/components/ui/button";
import { DefaultKeyWords } from "@/constants/texts";

type Props = {
  onSelect: (e: string) => void;
};
const AiGeneratorSidebar = ({ onSelect }: Props) => {
  return (
    <div className="w-[200px] p-2 border-l h-full overflow-y-auto">
      <p className="text-center font-semibold p-2">Available Keywords</p>
      <div className="flex flex-wrap gap-2">
        {DefaultKeyWords.map((keyword) => (
          <Button
            key={keyword.value}
            variant="outline"
            className="rounded-sm"
            size="xs"
            onClick={() => onSelect(keyword.value)}
          >
            {keyword.name}
          </Button>
        ))}
      </div>
      {/* <pre>{JSON.stringify(DefaultKeyWords, null, 4)}</pre> */}
    </div>
  );
};

export default AiGeneratorSidebar;
