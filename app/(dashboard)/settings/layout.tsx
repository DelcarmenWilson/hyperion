import { Sidebar } from "@/app/(settings)/components/sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className=" flex-1 w-full px-4 overflow-y-auto">{children}</div>
    </div>
  );
}
