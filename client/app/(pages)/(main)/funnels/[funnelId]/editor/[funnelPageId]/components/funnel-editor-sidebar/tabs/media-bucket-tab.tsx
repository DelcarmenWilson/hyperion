"use client";
import React, { useEffect, useState } from "react";
import { GetMediaFiles } from "@/types/media";
import MediaComponent from "@/components/media";
import { mediaGetAll } from "@/actions/media";

type Props = {
  subaccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<GetMediaFiles>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await mediaGetAll();
      setdata(response);
    };
    fetchData();
  }, [props.subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} />
    </div>
  );
};

export default MediaBucketTab;
