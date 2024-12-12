import React from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const data = [
  {
    title:
      "It Has Been a Great Experience and Helped Out a lot with My Follow-up Process",
    testimonial:
      "The follow-up process, and the pipeline feature. I'm able to call more leads with the pipeline feature and connect with more leads. Also adding a vendor to Ringy is very simple.",
    image: "Andrew S.",
    name: "Andrew S.",
    personTitle: "Licensed Health Insurance Agent",
  },
  {
    title: "Overall This Product Increased My Sales by Double Year Over Year!",
    testimonial:
      "Easy to use, Marketing Automation, Increased CPA, Local Presence dialing. iSalesCRM has made the sales process simple and effective. Brad also is always ready to answer your questions and makes all the difference in the world. The software is full of features and is always adding new and better ones to continue to improve and have an edge over its competitors. It is definitely responsible for my success and I recommend it to everyone.",
    image: "Andrew S.",
    name: " Lucas F.",
    personTitle: "Field Training Agent",
  },

  {
    title: "Terrific CRM for Online Sales!",
    testimonial:
      "The text/email drip feature is the best feature. you can set up weeks of drips to go out to prospective buyers. This level of follow-up helps you stand out in a big way. Linking your Calendly to a text drip to help get appointments is also a wonderful tool.",
    image: "Andrew S.",
    name: "Liam S.",
    personTitle: "Licensed Health Coverage Providor",
  },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-2 bg-white">
      <div>
        <p className="text-pink-400 font-serif text-2xl">Testimonials</p>

        <p className="font-serif text-5xl">See why companies trust Hyperion.</p>

        <Button variant="landingOutline" size="lg">
          TRY HYPERION FOR FREE
        </Button>
      </div>
      <div className="mx-auto max-w-xs ">
        <CarouselSpacing />
      </div>
    </div>
  );
};

const CarouselSpacing = () => {
  // const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      // className="flex-1 flex gap-2 items-center justify-between"
      className="w-full max-w-xs"
      orientation="vertical"
      // plugins={[plugin.current]}
      // onMouseEnter={plugin.current.stop}
      // onMouseLeave={plugin.current.reset}
    >
      <CarouselPrevious />
      <CarouselContent className="-ml-1 h-full">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className="pl-1 md:basis-1/2 lg:basis-1/3 flex-center"
          >
            <TestimonialCard
              title={item.title}
              testimonial={item.testimonial}
              image={item.image}
              name={item.name}
              personTitle={item.personTitle}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
};

const TestimonialCard = ({
  title,
  testimonial,
  image,
  name,
  personTitle,
}: {
  title: string;
  testimonial: string;
  image: string;
  name: string;
  personTitle: string;
}) => {
  return (
    <div className="space-y-2">
      <p className="font-bold text-3xl">{title}</p>
      <p className="text-sm">{testimonial}</p>

      <div className="flex gap-2 items-center">
        <Image
          src="/assets/defaults/teamImage.jpg"
          width={60}
          height={60}
          className="rounded-full w-[60px] h-[60px]"
          alt={name}
        />
        <div className="text-sm">
          <p className="font-bold uppercase">{name}</p>
          <p className="text-muted-foreground uppercase">{personTitle}</p>
        </div>
      </div>
    </div>
  );
};
export default Testimonials;
