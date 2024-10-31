import { useEffect, useRef, useState } from "react";

export const useScroller=(fetching:boolean)=>{
    const bottomRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(true);


  // handles the animation when scrolling to the top
  const scrollToBottom = (type: boolean = false) => {
    bottomRef.current?.scrollIntoView({
      behavior: type ? "smooth" : loaded ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    if (loaded) return;
    scrollToBottom();
    setLoaded(true);
  }, [fetching]);

  useEffect(() => {
    if (!parentRef.current) return;
    const toggleVisibility = () => {
      const height = parentRef.current?.scrollHeight!;
      const scrolled = parentRef.current?.scrollTop!;
      // if the user scrolls up, show the button
      scrolled < -700 ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    parentRef.current?.addEventListener("scroll", toggleVisibility);

    // clear the listener on component unmount
    return () => {
      parentRef.current?.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return {bottomRef,parentRef,isVisible,scrollToBottom}
}