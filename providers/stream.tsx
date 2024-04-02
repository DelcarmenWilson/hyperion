"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";

import { tokenProvider } from "@/actions/stream";
import { useCurrentUser } from "@/hooks/use-current-user";
import Loader from "@/components/reusable/loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.name || user?.id,
        image: user?.image,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamProvider;
