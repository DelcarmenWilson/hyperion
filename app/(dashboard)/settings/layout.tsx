import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Cog, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavBar } from "./components/navbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex flex-1 overflow-hidden">
    //   <Sidebar />
    //   <div className=" flex-1 w-full px-4 overflow-y-auto">{children}</div>
    // </div>
    <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
      <div className="flex items-center gap-2 mb-2 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Cog className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Settings
          </CardTitle>
        </div>
        <NavBar />
        {/* <div className="flex gap-2 mr-6">
          <Button variant="outlineprimary" size="sm">
            <DownloadCloud className="h-4 w-4 mr-2" />
            GENERATE CSV
          </Button>
        </div> */}
      </div>

      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        <ScrollArea className="w-full flex-1 px-2">{children}</ScrollArea>
      </CardContent>
    </Card>
  );
}
