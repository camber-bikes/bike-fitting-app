import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Animated,
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

type Direction = "up" | "down" | "left" | "right";

export default function InstructionCard({
  direction,
  amount,
}: {
  direction: Direction;
  amount: number;
}) {
  const [isToggled, setIsToggled] = useState(false);
  const [heightAnimation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    setIsToggled((old) => !old);

    Animated.timing(heightAnimation, {
      toValue: isToggled ? 0 : 150,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <Pressable onPress={toggleAccordion}>
        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <View style={styles.iconHolder}>
              <View style={styles.saddleIconContainer}>
                <Image
                  source={require("@/assets/images/saddle.png")}
                  style={styles.saddleIcon}
                />
              </View>
              <FontAwesome5
                name={"arrow-" + direction}
                style={styles.arrowIcon}
              />
            </View>
            <Text style={styles.resultText}>{`${amount} cm`}</Text>
            <Text style={styles.resultText}>{`Move saddle ${direction}`}</Text>
          </View>
        </View>
        <Animated.View style={{ height: heightAnimation }}>
          {isToggled && (
            <View>
              <Text style={styles.resultText}>
                {direction == "up"
                  ? `Your saddle is too low. Adjust it by ${amount} cm to achieve an optimal knee angle for improved cycling efficiency and long-term joint health.`
                  : direction == "down"
                    ? `Your saddle is too high. Lower it by ${amount} cm for optimal knee alignment, improving both performance and comfort while preventing strain.`
                    : direction == "left"
                      ? `Your saddle is too far right. Shift it ${amount} cm to the left to maintain an optimal posture, ensuring better elbow and back alignment for healthier cycling.`
                      : direction == "right"
                        ? `Your saddle is too far left. Shift it ${amount} cm to the right for optimal balance, which enhances your back posture and promotes healthy joint movement.`
                        : ""}
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 20,
    padding: 10,
    margin: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardTitle: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  saddleIconContainer: {
    width: 30,
    aspectRatio: 1,
  },
  saddleIcon: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  arrowIcon: {
    height: "10%",
    width: "10%",
    alignSelf: "center",
  },
  iconHolder: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
