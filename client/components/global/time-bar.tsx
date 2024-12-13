import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

type Props = {
  duration?: number;
  onClose?: () => void;
  hover?: boolean;
  hold?: boolean;
  enable?: boolean;
};

export const TimerBar = ({
  duration = 5,
  onClose,
  hover = false,
  hold = false,
  enable = false,
}: Props) => {
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hold || !enable) return;
    setIntervalId(
      setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(intervalId!);
            if (onClose) onClose();
            return 0;
          }
          return prevProgress - 100 / (duration * 10); // Update every 100ms
        });
      }, 100)
    );

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [duration, hold, enable]);

  useEffect(() => {
    if (!hover) return;
    if (!intervalId) return;
    clearInterval(intervalId!);
    setProgress(0);
  }, [hover]);
  if (!enable) return null;
  return (
    <Progress
      className={cn("h-2", progress <= 0 && "opacity-0")}
      value={progress}
    />
  );
};

// export const TimerBar = ({ duration = 5, onClose }: Props) => {
//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress <= 0) {
//           clearInterval(interval);
//           if (onClose) onClose();
//           return 0;
//         }
//         return prevProgress - 100 / (duration * 10); // Update every 100ms
//       });
//     }, 100);

//     return () => clearInterval(interval);
//   }, [duration]);

//   return <Progress className="h-2" value={progress} />;
// };
