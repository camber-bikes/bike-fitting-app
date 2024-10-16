import React from "react";
import Tutorial from "@/components/Tutorial";

export default function TutorialScreen() {
  return (
    <Tutorial
      nextScreen="recordPhoto"
      imageSource={require("../assets/images/photo-tutorial.png")}
      title="Take Image"
      description="Take an image of you next to your bike. Your whole body must be visible"
    />
  );
}
