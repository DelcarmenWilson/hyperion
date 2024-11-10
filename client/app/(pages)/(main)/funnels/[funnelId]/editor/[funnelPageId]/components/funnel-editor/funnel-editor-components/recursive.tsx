import React from "react";
import { EditorElement } from "@/providers/editor";
// import Checkout from "./checkout";
import Container from "./container";
// import ContactFormComponent from "./contact-form-component";
import LinkComponent from "./link-component";
import TextComponent from "./text";
import VideoComponent from "./video";

const Recursive = ({ element }: { element: EditorElement }) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    // case "contactForm":
    //   return <ContactFormComponent element={element} />;
    // case "paymentForm":
    //   return <Checkout element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;
