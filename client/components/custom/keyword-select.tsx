"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DefaultKeyWords } from "@/constants/texts";

type KeywordSelectProps = {
  onSetKeyWord: (e: string) => void;
};
export const KeywordSelect = ({ onSetKeyWord }: KeywordSelectProps) => {
  return (
    <Select name="ddlKeywords" onValueChange={onSetKeyWord}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Available Keywords" />
      </SelectTrigger>
      <SelectContent className="h-56">
        {DefaultKeyWords.map((keyword) => (
          <SelectItem key={keyword.value} value={keyword.value}>
            {keyword.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
