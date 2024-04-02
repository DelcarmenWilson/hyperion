import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PermissionCardProps {
  title: string;
  icon?: LucideIcon;
}

const Alert = ({ title, icon: Icon }: PermissionCardProps) => {
  return (
    <section className="flex-center h-screen w-full">
      <Card className="w-full max-w-[520px] border-none bg-dark-1 p-6 py-9 text-white">
        <CardContent>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {Icon && (
                <div className="flex justify-center items-center">
                  <Icon size={72} />
                </div>
              )}
              <p className="text-center text-xl font-semibold">{title}</p>
            </div>

            <Button asChild className="bg-blue-1">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;
