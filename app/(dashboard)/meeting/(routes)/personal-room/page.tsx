"use client";

import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

import { useGetCallById } from "@/hooks/use-get-call-by-id";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CopyButton } from "@/components/reusable/copy-button";
import { Heading } from "@/components/custom/heading";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-primary lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <p className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </p>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const client = useStreamVideoClient();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-1">
      <Heading title="Personal Meeting Room" />
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.name}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button onClick={startRoom}>Start Meeting</Button>
        <CopyButton
          value={meetingLink}
          variant="outlineprimary"
          message="Link"
          text="Copy Invitation"
          size="default"
        />
      </div>
    </section>
  );
};

export default PersonalRoom;
