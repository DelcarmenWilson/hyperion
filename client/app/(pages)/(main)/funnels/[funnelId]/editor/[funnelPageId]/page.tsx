import React from "react";
import { redirect } from "next/navigation";

import FunnelEditorNavigation from "./components/funnel-editor-navigation";
import FunnelEditorSidebar from "./components/funnel-editor-sidebar";
import FunnelEditor from "./components/funnel-editor";
import EditorProvider from "@/providers/editor";
import { funnelPageGetById } from "@/actions/funnel/page";

type Props = {
  params: {
    funnelId: string;
    funnelPageId: string;
  };
};

const Page = async ({ params }: Props) => {
  const funnelPageDetails = await funnelPageGetById(params.funnelPageId);
  if (!funnelPageDetails) {
    return redirect(`/funnels/${params.funnelId}`);
  }

  return (
    <div className="fixed flex flex-col top-14 p-2 left-0 right-0  bottom-0 z-[40] bg-background overflow-hidden">
      <EditorProvider
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
        />
        <div className="flex-1 w-full h-full flex items-center overflow-hidden">
          <FunnelEditor funnelPageId={params.funnelPageId} />
          <FunnelEditorSidebar />
        </div>
      </EditorProvider>
    </div>
  );
};

export default Page;
