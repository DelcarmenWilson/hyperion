import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestPage = async () => {
  return (
    <PageLayoutAdmin title="Test" description="Testing Twilio">
      <Tabs
        orientation="vertical"
        className="flex flex-col lg:flex-row gap-2 item-start h-full"
        defaultValue="conferences"
      >
        <TabsList className="flex flex-col w-full lg:w-[120px] gap-2 h-full">
          <TabsTrigger className="w-full" value="conferences">
            Conferences
          </TabsTrigger>
          <TabsTrigger className="w-full" value="queues">
            Queues
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="conferences">ConferenceClient</TabsContent>
          <TabsContent value="queues">QueuesClient</TabsContent>
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};
export default TestPage;

// function TestPage() {
//   const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_APP_KEY;
//   const imageApi = `https://api.unsplash.com/photos/?client_id=${apiKey}`;
//   const [images, setImages] = useState("");

//   const GetImages = () => {
//     axios.get("imageApi").then((response) => {
//       setImages(response.data);
//     });
//   };
//   return (
//     <PageLayoutAdmin title="Test" description="Testing Unplash">
//       <div>
//         <Button onClick={GetImages}>Get Images</Button>
//         <div>{JSON.stringify(images)}</div>
//       </div>
//     </PageLayoutAdmin>
//   );
// }
