import Quill from "quill";
import React, { useEffect, useRef, useState } from "react";
type Props = {
  value?: string | null;
};

const Renderer = ({ value }: Props) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;
    const container = rendererRef.current;
    const quill = new Quill(document.createElement("p"), { theme: "snow" });

    quill.enable(false);
    if (!value) return;
    const contents = JSON.parse(value);

    quill.setContents(contents);
    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);
  if (isEmpty) return null;
  return <p ref={rendererRef} />;
};

export default Renderer;
