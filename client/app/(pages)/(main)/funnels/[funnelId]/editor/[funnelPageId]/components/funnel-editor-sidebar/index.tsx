"use client";
import React from "react";
import { useEditor } from "@/providers/editor";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import TabList from "./tabs";
import SettingsTab from "./tabs/settings-tab";
import MediaBucketTab from "./tabs/media-bucket-tab";
import ComponentsTab from "./tabs/components-tab";
import { cn } from "@/lib/utils";

const FunnelEditorSidebar = () => {
  const { state, dispatch } = useEditor();

  return (
    <div
      className={cn("w-[400px]  h-full ml-auto", {
        hidden: state.editor.previewMode,
      })}
    >
      <Tabs className="w-full h-full flex border" defaultValue="Settings">
        <div className="flex-1 shadow-none p-0 bg-background h-full transition-all overflow-hidden">
          <div className="grid gap-4 h-full pb-36 overflow-y-auto">
            <TabsContent value="Settings">
              <div className="text-left p-6">
                <h4>Styles</h4>
                <p>
                  Show your creativity! You can customize every component as you
                  like.
                </p>
              </div>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Media">
              {/* TODO need to create the media table and folder in xamzon s3 */}
              {/* media bucket goes here */}
              {/* <MediaBucketTab subaccountId={subaccountId} /> */}
            </TabsContent>
            <TabsContent value="Components">
              <div className="text-left p-6 ">
                <h4>Components</h4>
                <p>You can drag and drop components on the canvas</p>
              </div>
              <ComponentsTab />
            </TabsContent>
          </div>
        </div>
        <div
          className={cn(
            "z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden",
            { hidden: state.editor.previewMode }
          )}
        >
          <TabList />
        </div>
      </Tabs>
    </div>
  );
};

// const FunnelEditorSidebar = () => {
//   const { state, dispatch } = useEditor();

//   return (
//     <Sheet open={true} modal={false}>
//       <Tabs className="w-full " defaultValue="Settings">
//         <SheetContent
//           showX={false}
//           side="right"
//           className={cn(
//             "mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden",
//             { hidden: state.editor.previewMode }
//           )}
//         >
//           <TabList />
//         </SheetContent>
//         <SheetContent
//           showX={false}
//           side="right"
//           className={cn(
//             "mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden ",
//             { hidden: state.editor.previewMode }
//           )}
//         >
//           <div className="grid gap-4 h-full pb-36 overflow-scroll">
//             <TabsContent value="Settings">
//               <SheetHeader className="text-left p-6">
//                 <SheetTitle>Styles</SheetTitle>
//                 <SheetDescription>
//                   Show your creativity! You can customize every component as you
//                   like.
//                 </SheetDescription>
//               </SheetHeader>
//               <SettingsTab />
//             </TabsContent>
//             <TabsContent value="Media">
//               {/* TODO need to create the media table and folder in xamzon s3 */}
//               {/* media bucket goes here */}
//               {/* <MediaBucketTab subaccountId={subaccountId} /> */}
//             </TabsContent>
//             <TabsContent value="Components">
//               <SheetHeader className="text-left p-6 ">
//                 <SheetTitle>Components</SheetTitle>
//                 <SheetDescription>
//                   You can drag and drop components on the canvas
//                 </SheetDescription>
//               </SheetHeader>
//               <ComponentsTab />
//             </TabsContent>
//           </div>
//         </SheetContent>
//       </Tabs>
//     </Sheet>
//   );
// };

export default FunnelEditorSidebar;
