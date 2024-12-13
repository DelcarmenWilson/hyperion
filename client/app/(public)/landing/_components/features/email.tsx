import React from "react";
import FeatureLayout from "./feature-layout";
import { emailData } from "./constants";
import DataBox from "./data-box";

const Email = () => {
  return (
    <FeatureLayout src="/assets/landing/dashboard.png" alt="phone">
      {emailData.map((item) => (
        <DataBox key={item.title} {...item} />
      ))}
    </FeatureLayout>
  );
};

export default Email;
