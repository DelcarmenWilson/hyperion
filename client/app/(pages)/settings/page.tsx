import { currentUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./components/profile-form";
import { AboutMeForm } from "./components/about-me-form";
import { ProfileImage } from "./components/profile-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userGetCurrent } from "@/data/user";

const SettingsPage = async () => {
  const ct = await currentUser();
  const user = await userGetCurrent(ct?.id as string);
  if (!user) return null;
  return (
    <Tabs
      className="flex flex-col lg:flex-row gap-2 item-start h-full"
      defaultValue="profile"
    >
      <TabsList className="flex flex-col w-full lg:w-[120px] gap-2 justify-start h-full">
        <ProfileImage image={user.image as string} />
        <TabsTrigger className="w-full" value="profile">
          Profile
        </TabsTrigger>
        <TabsTrigger className="w-full" value="aboutme">
          About Me
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 h-full">
        <TabsContent value="profile" className="h-full">
          <ScrollArea>
            <ProfileForm />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="aboutme" className="h-full">
          <ScrollArea>
            <AboutMeForm user={user!} />
          </ScrollArea>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
