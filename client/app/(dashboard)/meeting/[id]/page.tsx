"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

import { useGetCallById } from "@/hooks/use-get-call-by-id";
import Alert from "./components/alert";
import MeetingSetup from "./components/setup";
import MeetingRoom from "./components/room";
import { useCurrentUser } from "@/hooks/use-current-user";

const MeetingPage = () => {
  const { id } = useParams();
  const user = useCurrentUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
