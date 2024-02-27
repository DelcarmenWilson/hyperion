"use client";

import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

function TestPage() {
  const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_APP_KEY;
  const imageApi = `https://api.unsplash.com/photos/?client_id=${apiKey}`;
  const [images, setImages] = useState("");

  const GetImages = () => {
    axios.get("imageApi").then((response) => {
      setImages(response.data);
    });
  };
  return (
    <PageLayoutAdmin title="Test" description="Testing Unplash">
      <div>
        <Button onClick={GetImages}>Get Images</Button>
        <div>{JSON.stringify(images)}</div>
      </div>
    </PageLayoutAdmin>
  );
}
export default TestPage;
