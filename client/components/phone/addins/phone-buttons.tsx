import { usePhoneStore } from "@/stores/phone-store";
import { useCurrentRole } from "@/hooks/user/use-current";
import { Button } from "@/components/ui/button";
import { ALLADMINS } from "@/constants/user";

export const PhoneButtons = () => {
  const {
    script,
    showScript,
    onScriptOpen,
    onScriptClose,
    showQuoter,
    onQuoterOpen,
    onQuoterClose,
  } = usePhoneStore();
  const role = useCurrentRole();

  return (
    <div className="flex absolute bottom-0 left-1/2 -translate-x-1/2 justify-center gap-2 items-center">
      <Button
        className="capitalize"
        variant={showScript ? "default" : "outline"}
        onClick={() => {
          showScript ? onScriptClose() : onScriptOpen();
        }}
      >
        {script?.name}
      </Button>

      {ALLADMINS.includes(role!) && (
        <Button
          variant={showQuoter ? "default" : "outline"}
          onClick={() => {
            showQuoter ? onQuoterClose() : onQuoterOpen();
          }}
        >
          Quoter
        </Button>
      )}
    </div>
  );
};
