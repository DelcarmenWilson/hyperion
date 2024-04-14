"use client";
import { Roadmap } from "@prisma/client";
import React, { useState } from "react";
import { RoadmapCard } from "./card";

type RoadmapListProps = {
  initRoadmaps: Roadmap[];
};
export const RoadmapList = ({ initRoadmaps }: RoadmapListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initRoadmaps);

  const onRoadmapInserted = (e: Roadmap) => {
    setRoadmaps((roadmaps) => [...roadmaps, e]);
    setIsOpen(false);
  };

  const onRoadmapDeleted = (id: string) => {
    setRoadmaps((roadmaps) => roadmaps.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {roadmaps.map((roadmap) => (
        <RoadmapCard
          key={roadmap.id}
          initRoadmap={roadmap}
          onRoadmapDeleted={onRoadmapDeleted}
        />
      ))}
    </div>
  );
};
