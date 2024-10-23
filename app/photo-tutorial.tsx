import React from "react";
import { StyleSheet } from "react-native";
import Tutorial from "@/components/Tutorial";
import { ThemedText } from "@/components/ThemedText";

export default function TutorialScreen() {
  return (
    <Tutorial
      nextScreen="recordPhoto"
      imageSource={require("../assets/images/photo-tutorial.png")}
      title="Take Image"
    >
      <ThemedText style={styles.paragraph}>
        Take an image of you next to your bike. Your whole body must be visible.
      </ThemedText>
      <ThemedText>
        Make sure there is no other person on the picture.
      </ThemedText>
      <ThemedText>
        After you took the picture, don't move for the next step.
      </ThemedText>
    </Tutorial>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 20,
  },
});
