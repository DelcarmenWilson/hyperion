"use client";
import React, { useEffect } from "react";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor";

import { Button } from "@/components/ui/button";

import Recursive from "./funnel-editor-components/recursive";
import { funnelPageGetById } from "@/actions/funnel/page";

type Props = { funnelPageId: string; liveMode?: boolean };

const FunnelEditor = ({ funnelPageId, liveMode }: Props) => {
  const { dispatch, state } = useEditor();

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  //CHALLENGE: make this more performant
  useEffect(() => {
    const fetchData = async () => {
      const response = await funnelPageGetById(funnelPageId);
      if (!response) return;

      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: response.content ? JSON.parse(response?.content) : "",
          withLive: !!liveMode,
        },
      });
    };
    fetchData();
  }, [funnelPageId]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnpreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  return (
    <div className="flex flex-1 justify-center w-full h-full">
      <div
        className={cn(
          "use-automation-zoom-in h-full overflow-hidden transition-all rounded-md",
          {
            "!p-0 !mr-0":
              state.editor.previewMode === true ||
              state.editor.liveMode === true,
            "!w-[650px]": state.editor.device === "Tablet",
            "!w-[420px]": state.editor.device === "Mobile",
            "w-full": state.editor.device === "Desktop",
          }
        )}
        onClick={handleClick}
      >
        {state.editor.previewMode && state.editor.liveMode && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-6 h-6  p-[2px] absolute top-4 left-1/2 z-[100]"
            onClick={handleUnpreview}
          >
            <EyeOff />
          </Button>
        )}
        {Array.isArray(state.editor.elements) &&
          state.editor.elements.map((childElement) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
      </div>
    </div>
  );
};

export default FunnelEditor;
