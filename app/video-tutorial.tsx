import React from "react";
import Tutorial from "@/components/Tutorial";

export default function TutorialScreen() {
  return (
    <Tutorial
      nextScreen="recordVideo"
      imageSource={require("../assets/images/video-tutorial.png")}
      title="Record video"
      description="Take a sideways video of you pedalling backwards on your bike. You can do this by leaning against a wall. Your whole body must be visible."
    />
  );
}
