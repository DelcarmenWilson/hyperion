import { usePhoneStore } from "@/hooks/use-phone";
import { useCurrentRole } from "@/hooks/user-current-role";
import { Button } from "@/components/ui/button";
import { allAdmins } from "@/constants/page-routes";

export const PhoneButtons = () => {
  const {
    lead,
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
        className=""
        variant={showScript ? "default" : "outline"}
        onClick={() => {
          showScript ? onScriptClose() : onScriptOpen();
        }}
      >
        {script?.title}
      </Button>

      {allAdmins.includes(role!) && (
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
