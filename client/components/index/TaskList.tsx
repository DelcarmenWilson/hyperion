"use client";
import Image from "next/image";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";

import { Gradient } from "./design/Task";
import { check2, grid, loading1 } from "@/public/assets/index";
import { Task } from "@prisma/client";
import { format } from "date-fns";

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <Section className="overflow-hidden" id="roadmap">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="What we’re working on" />
        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          <Gradient />
        </div>
        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
          <Button href="/task">Our task</Button>
        </div>
      </div>
    </Section>
  );
};

type TaskCardProps = {
  task: Task;
  colorful?: boolean;
};

export const TaskCard = ({ task, colorful = true }: TaskCardProps) => {
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
            <Tagline>{format(task.endAt, "MMMM yyyy")}</Tagline>

            <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
              <Image
                className="mr-2.5"
                src={task.status === "Done" ? check2 : loading1}
                width={16}
                height={16}
                alt={task.status}
              />
              <div className="tagline">{task.status}</div>
            </div>
          </div>

          <div className="mb-10 -my-10 -mx-15">
            <Image
              className="w-full"
              src={task.images!}
              width={628}
              height={426}
              alt={task.headLine}
            />
          </div>
          <h4 className="h4 mb-4">{task.headLine}</h4>
          <p className="body-2 text-n-4">{task.description}</p>
        </div>
      </div>
    </div>
  );
};
