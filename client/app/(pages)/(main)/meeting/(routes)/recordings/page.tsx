import { Heading } from "@/components/custom/heading";
import CallList from "@/components/meeting/call-list";

const RecordingsPage = () => {
  return (
    <section className="flex size-full flex-col gap-1">
      <Heading title="Recordings" description="View all recordings" />
      <CallList type="recordings" />
    </section>
  );
};

export default RecordingsPage;
