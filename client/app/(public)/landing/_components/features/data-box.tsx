import { FeatureType } from "./constants";

const DataBox = ({ icon: Icon, title, description }: FeatureType) => {
  return (
    <div className="flex items-start gap-5">
      <div className="flex-center bg-violet-700 p-4 rounded-full">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold text-lg my-2">{title}</p>
        <p className="w-[350px]">{description}</p>
      </div>
    </div>
  );
};
export default DataBox;
