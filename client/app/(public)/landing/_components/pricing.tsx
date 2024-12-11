import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Phone, Send, UserSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Pricing = () => {
  return (
    <div className="bg-gray-800 py-[100px] text-white space-y-6 pb-20">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-pink-500 text-3xl uppercase">Why choose Hyperion </p>
        <div className="w-[50%] text-center">
          <p className="text-5xl font-bold">
            With Hyperion, you&apos;re in the best position to close sales
          </p>
        </div>

        <p className="text-lg font-bold">
          Here are three reasons to choose Hyperion CRM over another solution:
        </p>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Box
          icon={Phone}
          title="24/7 Customer Service"
          description="Need some help? There’s someone available to give you the support you need, no matter what time you need it."
        />

        <Box
          icon={UserSquare}
          title="Unlimited Contacts"
          description="Some CRMs have tiered pricing that limits storage or contacts, but with Hyperion, you can have as many contacts as you need."
        />

        <Box
          icon={Send}
          title="Easy to Use"
          description="Forget learning curves and needing a degree to operate a CRM. Hyperion is fully featured but easy to navigate and use, meaning you can start selling faster."
        />
      </div>
      <div className="flex-center">
        <Button variant="landingMain" size="xl">
          View Pricing
        </Button>
      </div>

      <Dashboard />
    </div>
  );
};

const Box = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <Card className="bg-gray-600 border-gray-400">
      <CardContent className="flex gap-2 text-white py-2">
        <div className="w-20 pt-4 lg:pt-0">
          <div className="bg-purple-600 text-white rounded-full p-4 w-fit">
            <Icon size={20} />
          </div>
        </div>
        <div className="flex-1 ">
          <p className="uppercase">{title}</p>
          <p className="text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="relative flex-center pt-10 pb-20">
      <div className="relative rounded-lg">
      <Image
        src="/assets/landing/dashboard.png"
        height={800}
        width={800}
        alt="image1"
        className="w-[800px] h-[600px] bg-white rounded-lg p-2"
      />
      <div className="absolute inset-0 bg-black opacity-30"/>
      </div>

      <div className="absolute top-1/2 left-[150px]">
        <Image
          src="/assets/landing/phone.png"
          height={350}
          width={300}
          alt="phone"
          className="w-[200px] h-[350px] bg-white rounded-lg p-2 border border-slate-500"
        />
        <p className="text-white text-xl ">Desktop and smartphone app</p>
      </div>

      <div className="absolute top-[60%] left-[440px]">
        <Image
          src="/assets/landing/details.png"
          height={400}
          width={400}
          alt="phone"
          className="w-[400px] h-[300px] bg-white rounded-lg p-2 border border-slate-500"
        />
        <p className="text-white text-xl ">
          Automated and personalized marketing campaigns
        </p>
      </div>
      <div className="absolute top-[100] right-[50px]">
        <Image
          src="/assets/landing/chart.png"
          height={350}
          width={200}
          alt="phone"
          className="w-[200px] h-[350px] bg-white rounded-lg p-2 border border-slate-500"
        />
        <p className="text-white text-xl ">
          Instant performance and ROI insights
        </p>
      </div>
    </div>
  );
};

export default Pricing;
