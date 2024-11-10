"use client";
import { ParamProps } from "@/types/workflow/app-node";

const BrowserInstanceParam = ({ param }: ParamProps) => {
  return <p className="text-xs">{param.name}</p>;
};

export default BrowserInstanceParam;
