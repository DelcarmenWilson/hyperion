"use client";
import Image from "next/image";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";

import { Gradient } from "./design/Roadmap";
import { check2, grid, loading1 } from "@/public/assets/index";
import { Roadmap } from "@prisma/client";
import { format } from "date-fns";

type RoadmapProps = {
  roadmaps: Roadmap[];
};

export const RoadmapList = ({ roadmaps }: RoadmapProps) => {
  return (
    <Section className="overflow-hidden" id="roadmap">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="What we’re working on" />
        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}

          <Gradient />
        </div>
        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
          <Button href="/roadmap">Our roadmap</Button>
        </div>
      </div>
    </Section>
  );
};

type RoadmapCardProps = {
  roadmap: Roadmap;
  colorful?: boolean;
};

export const RoadmapCard = ({ roadmap, colorful = true }: RoadmapCardProps) => {
  return (
    <div
      className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] ${
        colorful ? "bg-conic-gradient" : "bg-n-6"
      }`}
    >
      <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
        <div className="absolute top-0 left-0 max-w-full">
          <Image
            className="w-full"
            src={grid}
            width={550}
            height={550}
            alt="Grid"
          />
        </div>
        <div className="relative z-1">
          <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
            <Tagline>{format(roadmap.endAt, "MMMM yyyy")}</Tagline>

            <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
              <Image
                className="mr-2.5"
                src={roadmap.status === "Done" ? check2 : loading1}
                width={16}
                height={16}
                alt={roadmap.status}
              />
              <div className="tagline">{roadmap.status}</div>
            </div>
          </div>

          <div className="mb-10 -my-10 -mx-15">
            <Image
              className="w-full"
              src={roadmap.images!}
              width={628}
              height={426}
              alt={roadmap.headLine}
            />
          </div>
          <h4 className="h4 mb-4">{roadmap.headLine}</h4>
          <p className="body-2 text-n-4">{roadmap.description}</p>
        </div>
      </div>
    </div>
  );
};
