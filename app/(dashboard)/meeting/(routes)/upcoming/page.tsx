import { Heading } from "@/components/custom/heading";
import CallList from "@/components/meeting/call-list";

const UpcomingPage = () => {
  return (
    <section className="flex size-full flex-col gap-10">
      <Heading
        title="Upcoming Meetings"
        description="View all upcoming meetings"
      />
      <CallList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;
