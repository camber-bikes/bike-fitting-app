import InstructionCard from "@/components/Results/InstructionCard";
import { useVideoPlayer, VideoView } from "expo-video";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
} from "react-native";
import { BASE_URL } from "@/constants/Api";
import { ScanContext } from "@/app/index";

export default function ResultsScreen() {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [result_x, setResultX] = useState(-100);
  const [result_y, setResultY] = useState(-100);
  const { scan_uuid } = useContext(ScanContext);

  const player = useVideoPlayer(
    `${BASE_URL}/scans/${scan_uuid}/videos/pedalling.mp4`,
    (player) => {
      player.loop = true;
      player.play();
    },
  );

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkEndpoint = async () => {
      try {
        const response = await fetch(`${BASE_URL}/scans/${scan_uuid}/result`);
        const data = await response.json();
        console.info(data);
        if (data.done) {
          setResultX(data.saddle_x_cm);
          setResultY(data.saddle_y_cm);
          setLoading(false); // Remove blur and spinner when finished
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching endpoint:", error);
        Alert.alert("Error", "could not fetch result");
      }
    };

    interval = setInterval(checkEndpoint, 5000); // Poll every 2 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [loading]);

  return (
    <ScrollView>
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.textloader}>
            Loading your results, please hang on
          </Text>
        </View>
      ) : (
        <>
          <View>
            <View style={styles.videoContainer}>
              <VideoView ref={ref} style={styles.video} player={player} />
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <InstructionCard
              direction={result_x > 0 ? "up" : "down"}
              amount={Math.round(result_x * 10) / 10}
            ></InstructionCard>
            <InstructionCard
              direction={result_y > 0 ? "left" : "right"}
              amount={Math.round(result_y * 10) / 10}
            ></InstructionCard>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly dim the background
  },
  textloader: {
    color: "white",
  },
  videoContainer: {
    width: "100%",
    paddingBottom: 50,
    paddingTop: 50,
    backgroundColor: "#ddd",
  },
  video: {
    height: 500,
  },
  instructionsContainer: {
    width: "100%",
    marginTop: 30,
  },
});
