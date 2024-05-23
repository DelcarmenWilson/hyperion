import Link from "next/link";

type TopMenuProps = { showLink: boolean };
export const TopMenu = ({ showLink = false }: TopMenuProps) => {
  return (
    <div className="flex gap-2 w-full text-sm text-muted-foreground text-right mr-6">
      {showLink && (
        <Link href="/appointments" className="text-primary hover:font-semibold">
          View All Appointments
        </Link>
      )}
    </div>
  );
};
