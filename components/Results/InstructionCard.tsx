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
      toValue: isToggled ? 0 : 200,
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
                  ? "Your saddle is to low, you should adjust it with the provided amount to correct your knee angle while cycling"
                  : direction == "down"
                    ? "Your saddle is to far up, you should adjust it with the provided amount to correct your knee angle while cycling"
                    : direction == "left"
                      ? "Your saddle is to far right, you should adjust it with the provided amount to correct your elbow angle and back angle while cycling"
                      : direction == "right"
                        ? "Your saddle is to far left, you should adjust it with the provided amount to correct your elbow angle and back angle while cycling"
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
    padding: "2%",
    marginHorizontal: "3%",
    marginVertical: "3%",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: "3%",
    paddingHorizontal: "4%",
    marginBottom: "3%",
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
