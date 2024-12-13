import Image from "next/image";
import { ReactNode } from "react";
import { FeatureType } from "./constants";
import DataBox from "./data-box";

const FeatureLayout = ({
  type,
  data,
  src,
}: {
  type: string;
  data: FeatureType[];
  src: string;
}) => {
  return (
    <div className="grid grid-cols-2">
      <div className="px-8 space-y-5">
        {data.map((item) => (
          <DataBox key={item.title} {...item} />
        ))}
      </div>

      <div className="px-8">
        <Image
          src={src}
          height={800}
          width={800}
          alt={type}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default FeatureLayout;
