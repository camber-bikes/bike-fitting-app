import React from "react";
import { StyleSheet } from "react-native";
import Tutorial from "@/components/Tutorial";
import { ThemedText } from "@/components/ThemedText";

export default function TutorialScreen() {
  return (
    <Tutorial
      nextScreen="recordVideo"
      imageSource={require("../assets/images/video-tutorial.png")}
      title="Record video"
    >
      <ThemedText style={styles.paragraph}>
        Take a sideways video of you pedalling backwards on your bike. You can
        do this by leaning against a wall.
      </ThemedText>
      <ThemedText>The video should be max. 5 seconds long.</ThemedText>
      <ThemedText>Your whole body must be visible.</ThemedText>
      <ThemedText>
        Make sure there is no other person on the picture.
      </ThemedText>
    </Tutorial>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 20,
  },
});
