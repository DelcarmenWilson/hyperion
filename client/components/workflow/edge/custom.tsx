import React from "react";
import {
  EdgeProps,
  BezierEdge,
  StraightEdge,
  StepEdge,
  SmoothStepEdge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "reactflow";

import { EdgeCloseButton } from "./close-button";

export const CustomBezier = (props: EdgeProps) => {
  const { id } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    ...props,
  });
  return (
    <>
      <BezierEdge {...props} />
      <EdgeCloseButton id={id} x={labelX} y={labelY} />
    </>
  );
};

export const CustomStraight = (props: EdgeProps) => {
  const { id } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    ...props,
  });
  return (
    <>
      <StraightEdge {...props} />
      <EdgeCloseButton id={id} x={labelX} y={labelY} />
    </>
  );
};
export const CustomStep = (props: EdgeProps) => {
  const { id } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    ...props,
  });
  return (
    <>
      <StepEdge {...props} />
      <EdgeCloseButton id={id} x={labelX} y={labelY} />
    </>
  );
};

export const CustomSmoothStep = (props: EdgeProps) => {
  const { id } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    ...props,
  });
  return (
    <>
      <SmoothStepEdge {...props} />
      <EdgeCloseButton id={id} x={labelX} y={labelY} />
    </>
  );
};
