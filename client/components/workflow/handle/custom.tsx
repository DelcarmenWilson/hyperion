import React from "react";
import { Handle, HandleProps } from "reactflow";

export const CustomCircle = (props: HandleProps) => {
  return (
    <Handle
      style={{
        width: 8,
        height: 8,
        background: "white",
        border: "1px solid #000",
      }}
      {...props}
    />
  );
};

export const CustomRectangle = (props: HandleProps) => {
  return (
    <Handle
      style={{
        width: 16,
        height: 8,
        background: "#ccc",
        border: "1px solid #000",
        borderRadius: 0,
      }}
      {...props}
    />
  );
};
