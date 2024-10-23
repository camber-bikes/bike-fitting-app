import InstructionCard from "@/components/Results/InstructionCard";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  useColorScheme,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { BASE_URL } from "@/constants/Api";
import { ScanContext } from "@/app/index";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ParamListBase } from "@react-navigation/native";

export default function ResultsScreen() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const ref = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoLink, setVideoLink] = useState("");
  const [result_x, setResultX] = useState(-100);
  const [result_y, setResultY] = useState(-100);
  const { scan_uuid } = useContext(ScanContext);
  const colorScheme = useColorScheme();
  const themeVideoContainer =
    colorScheme === "light"
      ? styles.lightVideoContainer
      : styles.darkVideoContainer;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkEndpoint = async () => {
      try {
        const response = await fetch(`${BASE_URL}/scans/${scan_uuid}/result`);
        const data = await response.json();

        if (data.done) {
          setResultX(data.saddle_x_cm);
          setResultY(data.saddle_y_cm);
          setVideoLink(`${BASE_URL}/scans/${scan_uuid}/videos/pedalling.mp4`);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching endpoint:", error);
        Alert.alert("Error", "could not fetch result");
      }
    };

    interval = setInterval(checkEndpoint, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ffffff" />
        <ThemedText style={styles.textloader}>
          Loading your results, please hang on
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={[styles.videoContainer, themeVideoContainer]}>
          <Video
            ref={ref}
            source={{ uri: videoLink }}
            rate={1.0}
            isMuted={true}
            shouldPlay
            isLooping={true}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
          />
        </View>
      </View>
      <View style={styles.instructionsContainer}>
        <InstructionCard
          direction={result_y > 0 ? "up" : "down"}
          amount={Math.round(result_y * 10) / 10}
        ></InstructionCard>
      </View>
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          type="secondary"
          onPress={() => navigate("history")}
          title="History"
        />
        <Button
          style={styles.button}
          onPress={() => navigate("index")}
          title="Home"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loadingScreen: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textloader: {
    color: "white",
  },
  videoContainer: {
    width: "100%",
    padding: 50,
  },
  video: {
    height: 500,
  },
  instructionsContainer: {
    width: "100%",
    marginTop: 30,
  },
  lightVideoContainer: {
    backgroundColor: "#ddd",
  },
  darkVideoContainer: {
    backgroundColor: "#282828",
  },
  buttons: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    width: "45%",
  },
});
