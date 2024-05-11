import { Heading } from "@/components/custom/heading";
import CallList from "@/components/meeting/call-list";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-1">
      <Heading
        title="Previous Calls"
        description="View all previous meetings"
      />
      <CallList type="ended" />
    </section>
  );
};

export default PreviousPage;
